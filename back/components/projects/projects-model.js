import mongoose from 'mongoose';
import { z } from 'zod';

const localizedTextSchema = z.object({
    ua: z.string().trim().min(1),
    en: z.string().trim().min(1),
});

const localizedOptionalTextSchema = z.object({
    ua: z.string().trim().default(''),
    en: z.string().trim().default(''),
});

const localizedMongoTextSchema = new mongoose.Schema({
    ua: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
}, { _id: false });

const localizedMongoOptionalTextSchema = new mongoose.Schema({
    ua: { type: String, default: '', trim: true },
    en: { type: String, default: '', trim: true },
}, { _id: false });

export const projectSchema = z.object({
    slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    img: z.string().trim().default('/imgs/projects/1.png'),
    href: z.string().trim().url(),
    title: localizedTextSchema,
    summary: localizedOptionalTextSchema.default({ ua: '', en: '' }),
    tags: z.array(z.string()).default([]),
});

const projectMongoSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true, trim: true },
    img: { type: String, default: '/imgs/projects/1.png', trim: true },
    href: { type: String, required: true, trim: true },
    title: { type: localizedMongoTextSchema, required: true },
    summary: { type: localizedMongoOptionalTextSchema, default: () => ({ ua: '', en: '' }) },
    tags: { type: [String], default: [] },
    detailAvailable: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
});

export const ProjectModel = mongoose.models.Project || mongoose.model('Project', projectMongoSchema);

export function mapProjectListItem(project, locale) {
    return {
        slug: project.slug,
        img: project.img,
        href: project.href,
        title: project.title[locale],
        summary: project.summary[locale],
        detailAvailable: Boolean(project.detailAvailable),
        createdAt: project.createdAt,
    };
}
