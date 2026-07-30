import { MediaModel } from '../components/media/media-model.js';
import { ProjectModel } from '../components/projects/projects-model.js';
import { deleteFileFromR2, getR2ObjectKeyFromUrl } from './r2.js';
import { createHttpError } from './httpError.js';

function serializeDocument(document) {
    if (!document) {
        return document;
    }

    const rawDocument = typeof document.toObject === 'function'
        ? document.toObject({ versionKey: false })
        : document;
    const { _id, tags, ...rest } = rawDocument;

    return rest;
}

async function listProjects() {
    const items = await ProjectModel
        .find({})
        .sort({ createdAt: -1 })
        .lean()
        .exec();

    return items.map(serializeDocument);
}

async function listMedia() {
    const items = await MediaModel
        .find({})
        .sort({ createdAt: -1 })
        .lean()
        .exec();

    return items.map(serializeDocument);
}

function isDuplicateKeyError(error) {
    return error && typeof error === 'object' && error.code === 11000;
}

function isDuplicateFieldError(error, field) {
    return isDuplicateKeyError(error)
        && (
            error.keyPattern?.[field] === 1
            || Object.prototype.hasOwnProperty.call(error.keyValue || {}, field)
        );
}

async function isImageReferencedAnywhere(imgKey) {
    if (!imgKey) {
        return false;
    }

    const [projectReferenceExists, mediaReferenceExists] = await Promise.all([
        ProjectModel.exists({ imgKey }),
        MediaModel.exists({ imgKey }),
    ]);

    return Boolean(projectReferenceExists || mediaReferenceExists);
}

async function cleanupOrphanedR2Object(imgKey, route) {
    if (!imgKey) {
        return;
    }

    const isStillReferenced = await isImageReferencedAnywhere(imgKey);

    if (isStillReferenced) {
        return;
    }

    await deleteFileFromR2(imgKey, route);
}

function withManagedImageKey(item) {
    return {
        ...item,
        imgKey: getR2ObjectKeyFromUrl(item.img),
    };
}

async function safelyCleanupOrphanedR2Object(imgKey, route) {
    try {
        await cleanupOrphanedR2Object(imgKey, route);
    } catch {
        // The primary MongoDB mutation already succeeded. The R2 service logged safe context.
    }
}

export async function readAdminContent() {
    const [projects, media] = await Promise.all([
        listProjects(),
        listMedia(),
    ]);

    return {
        projects,
        media,
    };
}

export async function appendProject(project) {
    const nextProject = withManagedImageKey(project);

    try {
        await ProjectModel.create(nextProject);
    } catch (error) {
        await safelyCleanupOrphanedR2Object(nextProject.imgKey, 'POST /api/admin/projects rollback');

        if (isDuplicateFieldError(error, 'href')) {
            throw createHttpError(409, 'A project with this link already exists.');
        }

        if (isDuplicateKeyError(error)) {
            throw createHttpError(409, 'A project conflicts with an existing record.');
        }

        throw error;
    }

    return listProjects();
}

export async function updateProjectByHref(currentHref, nextProject) {
    const currentProject = await ProjectModel.findOne({ href: currentHref }).exec();

    if (!currentProject) {
        throw createHttpError(404, 'Project not found.');
    }

    if (nextProject.href !== currentHref) {
        const existingProject = await ProjectModel.exists({ href: nextProject.href });

        if (existingProject) {
            throw createHttpError(409, 'A project with this link already exists.');
        }
    }

    const previousImageKey = currentProject.imgKey;
    const projectWithImageKey = withManagedImageKey(nextProject);

    currentProject.set(projectWithImageKey);

    try {
        await currentProject.save();
    } catch (error) {
        if (projectWithImageKey.imgKey !== previousImageKey) {
            await safelyCleanupOrphanedR2Object(
                projectWithImageKey.imgKey,
                'PUT /api/admin/projects rollback'
            );
        }
        throw error;
    }

    if (previousImageKey !== currentProject.imgKey) {
        await safelyCleanupOrphanedR2Object(previousImageKey, 'PUT /api/admin/projects cleanup');
    }

    return listProjects();
}

export async function deleteProjectByHref(href) {
    const project = await ProjectModel.findOne({ href }).exec();

    if (!project) {
        throw createHttpError(404, 'Project not found.');
    }

    const imageKeyToCleanup = project.imgKey;

    await project.deleteOne();

    await safelyCleanupOrphanedR2Object(imageKeyToCleanup, 'DELETE /api/admin/projects');

    return listProjects();
}

export async function appendMediaItem(mediaItem) {
    const nextMediaItem = withManagedImageKey(mediaItem);

    try {
        await MediaModel.create(nextMediaItem);
    } catch (error) {
        await safelyCleanupOrphanedR2Object(nextMediaItem.imgKey, 'POST /api/admin/media rollback');

        if (isDuplicateFieldError(error, 'sourceUrl')) {
            throw createHttpError(409, 'A media item with this source URL already exists.');
        }

        if (isDuplicateKeyError(error)) {
            throw createHttpError(409, 'A media item conflicts with an existing record.');
        }

        throw error;
    }

    return listMedia();
}

export async function updateMediaBySourceUrl(currentSourceUrl, nextMediaItem) {
    const currentMediaItem = await MediaModel.findOne({ sourceUrl: currentSourceUrl }).exec();

    if (!currentMediaItem) {
        throw createHttpError(404, 'Media item not found.');
    }

    if (nextMediaItem.sourceUrl !== currentSourceUrl) {
        const existingMediaItem = await MediaModel.exists({ sourceUrl: nextMediaItem.sourceUrl });

        if (existingMediaItem) {
            throw createHttpError(409, 'A media item with this source URL already exists.');
        }
    }

    const previousImageKey = currentMediaItem.imgKey;
    const mediaItemWithImageKey = withManagedImageKey(nextMediaItem);

    currentMediaItem.set(mediaItemWithImageKey);

    try {
        await currentMediaItem.save();
    } catch (error) {
        if (mediaItemWithImageKey.imgKey !== previousImageKey) {
            await safelyCleanupOrphanedR2Object(
                mediaItemWithImageKey.imgKey,
                'PUT /api/admin/media rollback'
            );
        }
        throw error;
    }

    if (previousImageKey !== currentMediaItem.imgKey) {
        await safelyCleanupOrphanedR2Object(previousImageKey, 'PUT /api/admin/media cleanup');
    }

    return listMedia();
}

export async function deleteMediaBySourceUrl(sourceUrl) {
    const mediaItem = await MediaModel.findOne({ sourceUrl }).exec();

    if (!mediaItem) {
        throw createHttpError(404, 'Media item not found.');
    }

    const imageKeyToCleanup = mediaItem.imgKey;

    await mediaItem.deleteOne();
    await safelyCleanupOrphanedR2Object(imageKeyToCleanup, 'DELETE /api/admin/media');

    return listMedia();
}
