import mongoose from 'mongoose';
import { z } from 'zod';
import { httpUrlSchema, imageReferenceSchema } from '../../src/validation.js';

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
    img: imageReferenceSchema.default('/imgs/projects/1.png'),
    href: httpUrlSchema,
    category: localizedTextSchema.default({ ua: 'Загальне', en: 'General' }),
    title: localizedTextSchema,
    summary: localizedOptionalTextSchema.default({ ua: '', en: '' }),
});

const projectMongoSchema = new mongoose.Schema({
    img: { type: String, default: '/imgs/projects/1.png', trim: true },
    href: { type: String, required: true, unique: true, trim: true },
    category: { type: localizedMongoTextSchema, default: () => ({ ua: 'Загальне', en: 'General' }) },
    title: { type: localizedMongoTextSchema, required: true },
    summary: { type: localizedMongoOptionalTextSchema, default: () => ({ ua: '', en: '' }) },
}, {
    timestamps: true,
    versionKey: false,
});

export const ProjectModel = mongoose.models.Project || mongoose.model('Project', projectMongoSchema);

export function mapProjectListItem(project, locale) {
    const fallbackCategory = {
        ua: 'Загальне',
        en: 'General',
    };

    return {
        img: project.img,
        href: project.href,
        category: (project.category || fallbackCategory)[locale],
        title: project.title[locale],
        summary: project.summary[locale],
        createdAt: project.createdAt,
    };
}
