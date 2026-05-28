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

export const mediaSchema = z.object({
    slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    img: z.string().trim().default('/imgs/projects/1.png'),
    type: localizedTextSchema,
    title: localizedTextSchema,
    summary: localizedOptionalTextSchema.default({ ua: '', en: '' }),
    outlet: z.string().trim().default(''),
    sourceUrl: z.string().trim().url(),
    sourceLabel: localizedOptionalTextSchema.default({ ua: '', en: '' }),
});

const mediaMongoSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true, trim: true },
    img: { type: String, default: '/imgs/projects/1.png', trim: true },
    type: { type: localizedMongoTextSchema, required: true },
    title: { type: localizedMongoTextSchema, required: true },
    summary: { type: localizedMongoOptionalTextSchema, default: () => ({ ua: '', en: '' }) },
    outlet: { type: String, default: '', trim: true },
    sourceUrl: { type: String, required: true, trim: true },
    sourceLabel: { type: localizedMongoOptionalTextSchema, default: () => ({ ua: '', en: '' }) },
    detailAvailable: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
});

export const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaMongoSchema);

export function mapMediaListItem(mediaItem, locale) {
    return {
        slug: mediaItem.slug,
        img: mediaItem.img,
        type: mediaItem.type[locale],
        title: mediaItem.title[locale],
        summary: mediaItem.summary[locale],
        outlet: mediaItem.outlet,
        sourceUrl: mediaItem.sourceUrl,
        detailAvailable: Boolean(mediaItem.detailAvailable),
        createdAt: mediaItem.createdAt,
    };
}
