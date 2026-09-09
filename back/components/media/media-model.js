import mongoose from 'mongoose';
import { z } from 'zod';
import { httpUrlSchema, imageReferenceSchema } from '../../src/validation.js';

const optionalHttpUrlSchema = z.preprocess(
    (value) => (value === '' || value === undefined ? null : value),
    httpUrlSchema.nullable()
).default(null);

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

const optionalDateSchema = z.preprocess(
    (value) => (value === '' || value === undefined ? null : value),
    z.coerce.date().nullable()
).default(null);

export const mediaSchema = z.object({
    order: z.coerce.number().int().min(1).default(1),
    img: imageReferenceSchema.default('/imgs/projects/1.png'),
    type: localizedTextSchema,
    title: localizedTextSchema,
    summary: localizedOptionalTextSchema.default({ ua: '', en: '' }),
    outlet: z.string().trim().default(''),
    sourceUrl: optionalHttpUrlSchema,
    sourceLabel: localizedOptionalTextSchema.default({ ua: '', en: '' }),
    publishedAt: optionalDateSchema,
});

const mediaMongoSchema = new mongoose.Schema({
    order: { type: Number, default: 1, min: 1 },
    img: { type: String, default: '/imgs/projects/1.png', trim: true },
    imgKey: { type: String, default: null, trim: true },
    type: { type: localizedMongoTextSchema, required: true },
    title: { type: localizedMongoTextSchema, required: true },
    summary: { type: localizedMongoOptionalTextSchema, default: () => ({ ua: '', en: '' }) },
    outlet: { type: String, default: '', trim: true },
    sourceUrl: { type: String, default: null, trim: true },
    sourceLabel: { type: localizedMongoOptionalTextSchema, default: () => ({ ua: '', en: '' }) },
    publishedAt: { type: Date, default: null },
}, {
    timestamps: true,
    versionKey: false,
});

export const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaMongoSchema);

export function mapMediaListItem(mediaItem, locale) {
    return {
        id: String(mediaItem._id || mediaItem.id),
        order: mediaItem.order,
        img: mediaItem.img,
        type: mediaItem.type[locale],
        title: mediaItem.title[locale],
        summary: mediaItem.summary[locale],
        outlet: mediaItem.outlet,
        sourceUrl: mediaItem.sourceUrl,
        publishedAt: mediaItem.publishedAt,
        createdAt: mediaItem.createdAt,
    };
}
