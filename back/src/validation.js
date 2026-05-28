import { z } from 'zod';

const allowedProtocols = new Set(['http:', 'https:']);
const allowedLocalImagePathPrefixes = ['/uploads/', '/imgs/'];

export const httpUrlSchema = z
    .string()
    .trim()
    .url()
    .refine((value) => {
        try {
            const parsedUrl = new URL(value);
            return allowedProtocols.has(parsedUrl.protocol);
        } catch {
            return false;
        }
    }, 'Only http and https URLs are allowed.');

export const localImagePathSchema = z
    .string()
    .trim()
    .refine((value) => {
        if (!value.startsWith('/')) {
            return false;
        }

        if (value.startsWith('//') || value.includes('..')) {
            return false;
        }

        return allowedLocalImagePathPrefixes.some((prefix) => value.startsWith(prefix));
    }, 'Only safe local image paths are allowed.');

export const imageReferenceSchema = httpUrlSchema.or(localImagePathSchema);
