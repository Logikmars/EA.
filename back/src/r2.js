import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { createHttpError } from './httpError.js';

const requiredEnvironmentVariables = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_URL',
];
const managedObjectKeyPattern = /^media\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(?:jpg|png|webp|gif)$/;
const extensionsByMimeType = new Map([
    ['image/jpeg', 'jpg'],
    ['image/png', 'png'],
    ['image/webp', 'webp'],
    ['image/gif', 'gif'],
]);

let r2Client;
let r2Config;

export function getR2Config() {
    if (r2Config) {
        return r2Config;
    }

    const missingVariables = requiredEnvironmentVariables.filter((name) => !process.env[name]?.trim());

    if (missingVariables.length > 0) {
        throw new Error(`Missing required R2 environment variables: ${missingVariables.join(', ')}.`);
    }

    r2Config = {
        accountId: process.env.R2_ACCOUNT_ID.trim(),
        accessKeyId: process.env.R2_ACCESS_KEY_ID.trim(),
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY.trim(),
        bucket: process.env.R2_BUCKET_NAME.trim(),
        publicUrl: process.env.R2_PUBLIC_URL.trim().replace(/\/+$/, ''),
    };

    return r2Config;
}

export function validateR2Config() {
    getR2Config();
}

function getR2Client() {
    if (!r2Client) {
        const config = getR2Config();

        r2Client = new S3Client({
            region: 'auto',
            endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
        });
    }

    return r2Client;
}

export function createR2ObjectKey(mimeType, now = new Date()) {
    const extension = extensionsByMimeType.get(mimeType);

    if (!extension) {
        throw createHttpError(400, 'Only JPG, PNG, WEBP, and GIF image files are allowed.');
    }

    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');

    return `media/${year}/${month}/${randomUUID()}.${extension}`;
}

export function buildR2PublicUrl(key) {
    return `${getR2Config().publicUrl}/${key}`;
}

export function getR2ObjectKeyFromUrl(value) {
    if (typeof value !== 'string' || !value.trim()) {
        return null;
    }

    try {
        const publicBaseUrl = new URL(`${getR2Config().publicUrl}/`);
        const candidateUrl = new URL(value.trim());

        if (candidateUrl.origin !== publicBaseUrl.origin) {
            return null;
        }

        const basePath = publicBaseUrl.pathname.replace(/^\/|\/$/g, '');
        const candidatePath = decodeURIComponent(candidateUrl.pathname).replace(/^\/|\/$/g, '');
        const key = basePath
            ? candidatePath.slice(`${basePath}/`.length)
            : candidatePath;

        if (
            (basePath && !candidatePath.startsWith(`${basePath}/`))
            || !managedObjectKeyPattern.test(key)
        ) {
            return null;
        }

        return key;
    } catch {
        return null;
    }
}

export async function uploadFileToR2(file) {
    const key = createR2ObjectKey(file.mimetype);
    const config = getR2Config();

    try {
        await getR2Client().send(new PutObjectCommand({
            Bucket: config.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: 'public, max-age=31536000, immutable',
        }));
    } catch (error) {
        console.error('R2 operation failed.', {
            operation: 'upload',
            objectKey: key,
            route: 'POST /api/admin/upload-image',
            errorType: error?.name || 'UnknownError',
        });
        throw createHttpError(502, 'Unable to store the uploaded image.', { expose: true });
    }

    return {
        key,
        url: buildR2PublicUrl(key),
        mimeType: file.mimetype,
        size: file.size,
        originalName: file.originalname,
    };
}

export async function deleteFileFromR2(key, route = 'content mutation') {
    if (!managedObjectKeyPattern.test(key || '')) {
        return false;
    }

    try {
        await getR2Client().send(new DeleteObjectCommand({
            Bucket: getR2Config().bucket,
            Key: key,
        }));
        return true;
    } catch (error) {
        console.error('R2 operation failed.', {
            operation: 'delete',
            objectKey: key,
            route,
            errorType: error?.name || 'UnknownError',
        });
        throw error;
    }
}
