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

export const mediaSchema = z.object({
    img: imageReferenceSchema.default('/imgs/projects/1.png'),
    type: localizedTextSchema,
    title: localizedTextSchema,
    summary: localizedOptionalTextSchema.default({ ua: '', en: '' }),
    outlet: z.string().trim().default(''),
    sourceUrl: httpUrlSchema,
    sourceLabel: localizedOptionalTextSchema.default({ ua: '', en: '' }),
});

const mediaMongoSchema = new mongoose.Schema({
    img: { type: String, default: '/imgs/projects/1.png', trim: true },
    imgKey: { type: String, default: null, trim: true },
    type: { type: localizedMongoTextSchema, required: true },
    title: { type: localizedMongoTextSchema, required: true },
    summary: { type: localizedMongoOptionalTextSchema, default: () => ({ ua: '', en: '' }) },
    outlet: { type: String, default: '', trim: true },
    sourceUrl: { type: String, required: true, unique: true, trim: true },
    sourceLabel: { type: localizedMongoOptionalTextSchema, default: () => ({ ua: '', en: '' }) },
}, {
    timestamps: true,
    versionKey: false,
});

export const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaMongoSchema);

export function mapMediaListItem(mediaItem, locale) {
    return {
        img: mediaItem.img,
        type: mediaItem.type[locale],
        title: mediaItem.title[locale],
        summary: mediaItem.summary[locale],
        outlet: mediaItem.outlet,
        sourceUrl: mediaItem.sourceUrl,
        createdAt: mediaItem.createdAt,
    };
}
