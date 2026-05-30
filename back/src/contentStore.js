import { MediaModel } from '../components/media/media-model.js';
import { ProjectModel } from '../components/projects/projects-model.js';
import { deleteManagedUploadByFilename, getManagedUploadFilename } from './upload.js';
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

async function findAvailableMediaSlug(baseSlug) {
    let candidateSlug = baseSlug;
    let suffix = 2;

    while (await MediaModel.exists({ slug: candidateSlug })) {
        candidateSlug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }

    return candidateSlug;
}

async function isImageReferencedAnywhere(img) {
    if (!img) {
        return false;
    }

    const [projectReferenceExists, mediaReferenceExists] = await Promise.all([
        ProjectModel.exists({ img }),
        MediaModel.exists({ img }),
    ]);

    return Boolean(projectReferenceExists || mediaReferenceExists);
}

async function cleanupOrphanedUpload(img) {
    const filename = getManagedUploadFilename(img);

    if (!filename) {
        return;
    }

    const isStillReferenced = await isImageReferencedAnywhere(img);

    if (isStillReferenced) {
        return;
    }

    await deleteManagedUploadByFilename(filename);
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
    try {
        await ProjectModel.create({
            ...project,
            detailAvailable: false,
        });
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw createHttpError(409, 'A project with this slug already exists.');
        }

        throw error;
    }

    return listProjects();
}

export async function updateProjectBySlug(currentSlug, nextProject) {
    const currentProject = await ProjectModel.findOne({ slug: currentSlug }).exec();

    if (!currentProject) {
        throw createHttpError(404, 'Project not found.');
    }

    if (nextProject.slug !== currentSlug) {
        const existingProject = await ProjectModel.exists({ slug: nextProject.slug });

        if (existingProject) {
            throw createHttpError(409, 'A project with this slug already exists.');
        }
    }

    const previousImage = currentProject.img;

    currentProject.set({
        ...nextProject,
        detailAvailable: currentProject.detailAvailable ?? false,
    });

    await currentProject.save();
    if (previousImage !== currentProject.img) {
        await cleanupOrphanedUpload(previousImage);
    }

    return listProjects();
}

export async function deleteProjectBySlug(slug) {
    const project = await ProjectModel.findOne({ slug }).exec();

    if (!project) {
        throw createHttpError(404, 'Project not found.');
    }

    const imageToCleanup = project.img;

    await project.deleteOne();

    await cleanupOrphanedUpload(imageToCleanup);

    return listProjects();
}

export async function appendMediaItem(mediaItem) {
    const nextSlug = await findAvailableMediaSlug(mediaItem.slug);

    try {
        await MediaModel.create({
            ...mediaItem,
            slug: nextSlug,
            detailAvailable: false,
        });
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw createHttpError(409, 'A media item with this slug already exists.');
        }

        throw error;
    }

    return listMedia();
}

export async function updateMediaBySlug(currentSlug, nextMediaItem) {
    const currentMediaItem = await MediaModel.findOne({ slug: currentSlug }).exec();

    if (!currentMediaItem) {
        throw createHttpError(404, 'Media item not found.');
    }

    if (nextMediaItem.slug !== currentSlug) {
        const existingMediaItem = await MediaModel.exists({ slug: nextMediaItem.slug });

        if (existingMediaItem) {
            throw createHttpError(409, 'A media item with this slug already exists.');
        }
    }

    const previousImage = currentMediaItem.img;

    currentMediaItem.set({
        ...nextMediaItem,
        detailAvailable: currentMediaItem.detailAvailable ?? false,
    });

    await currentMediaItem.save();
    if (previousImage !== currentMediaItem.img) {
        await cleanupOrphanedUpload(previousImage);
    }

    return listMedia();
}

export async function deleteMediaBySlug(slug) {
    const mediaItem = await MediaModel.findOne({ slug }).exec();

    if (!mediaItem) {
        throw createHttpError(404, 'Media item not found.');
    }

    const imageToCleanup = mediaItem.img;

    await mediaItem.deleteOne();
    await cleanupOrphanedUpload(imageToCleanup);

    return listMedia();
}
