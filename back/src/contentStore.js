import { MediaModel } from '../components/media/media-model.js';
import { ProjectModel } from '../components/projects/projects-model.js';

function serializeDocument(document) {
    if (!document) {
        return document;
    }

    const rawDocument = typeof document.toObject === 'function'
        ? document.toObject({ versionKey: false })
        : document;
    const { _id, ...rest } = rawDocument;

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
            throw new Error('A project with this slug already exists.');
        }

        throw error;
    }

    return listProjects();
}

export async function updateProjectBySlug(currentSlug, nextProject) {
    const currentProject = await ProjectModel.findOne({ slug: currentSlug }).exec();

    if (!currentProject) {
        throw new Error('Project not found.');
    }

    if (nextProject.slug !== currentSlug) {
        const existingProject = await ProjectModel.exists({ slug: nextProject.slug });

        if (existingProject) {
            throw new Error('A project with this slug already exists.');
        }
    }

    currentProject.set({
        ...nextProject,
        detailAvailable: currentProject.detailAvailable ?? false,
    });

    await currentProject.save();

    return listProjects();
}

export async function deleteProjectBySlug(slug) {
    const deleteResult = await ProjectModel.deleteOne({ slug }).exec();

    if (!deleteResult.deletedCount) {
        throw new Error('Project not found.');
    }

    return listProjects();
}

export async function appendMediaItem(mediaItem) {
    try {
        await MediaModel.create({
            ...mediaItem,
            detailAvailable: false,
        });
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw new Error('A media item with this slug already exists.');
        }

        throw error;
    }

    return listMedia();
}

export async function updateMediaBySlug(currentSlug, nextMediaItem) {
    const currentMediaItem = await MediaModel.findOne({ slug: currentSlug }).exec();

    if (!currentMediaItem) {
        throw new Error('Media item not found.');
    }

    if (nextMediaItem.slug !== currentSlug) {
        const existingMediaItem = await MediaModel.exists({ slug: nextMediaItem.slug });

        if (existingMediaItem) {
            throw new Error('A media item with this slug already exists.');
        }
    }

    currentMediaItem.set({
        ...nextMediaItem,
        detailAvailable: currentMediaItem.detailAvailable ?? false,
    });

    await currentMediaItem.save();

    return listMedia();
}

export async function deleteMediaBySlug(slug) {
    const deleteResult = await MediaModel.deleteOne({ slug }).exec();

    if (!deleteResult.deletedCount) {
        throw new Error('Media item not found.');
    }

    return listMedia();
}
