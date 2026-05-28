import { existsSync, mkdirSync, unlink, writeFile } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import multer from 'multer';
import { uploadsDirectoryPath } from './paths.js';

const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);
const allowedMimeTypes = new Map([
    ['image/jpeg', '.jpg'],
    ['image/png', '.png'],
    ['image/webp', '.webp'],
    ['image/gif', '.gif'],
]);

if (!existsSync(uploadsDirectoryPath)) {
    mkdirSync(uploadsDirectoryPath, { recursive: true });
}

function sanitizeBaseName(originalname) {
    const extension = path.extname(originalname || '');

    return path.basename(originalname || 'upload', extension)
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '') || 'upload';
}

function isPng(buffer) {
    return buffer.length >= 8
        && buffer[0] === 0x89
        && buffer[1] === 0x50
        && buffer[2] === 0x4e
        && buffer[3] === 0x47
        && buffer[4] === 0x0d
        && buffer[5] === 0x0a
        && buffer[6] === 0x1a
        && buffer[7] === 0x0a;
}

function isJpeg(buffer) {
    return buffer.length >= 3
        && buffer[0] === 0xff
        && buffer[1] === 0xd8
        && buffer[2] === 0xff;
}

function isGif(buffer) {
    if (buffer.length < 6) {
        return false;
    }

    const header = buffer.subarray(0, 6).toString('ascii');
    return header === 'GIF87a' || header === 'GIF89a';
}

function isWebp(buffer) {
    if (buffer.length < 12) {
        return false;
    }

    return buffer.subarray(0, 4).toString('ascii') === 'RIFF'
        && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
}

function detectImageExtension(buffer) {
    if (isPng(buffer)) return '.png';
    if (isJpeg(buffer)) return '.jpg';
    if (isGif(buffer)) return '.gif';
    if (isWebp(buffer)) return '.webp';

    return null;
}

function fileFilter(req, file, callback) {
    if (allowedMimeTypes.has(file.mimetype)) {
        callback(null, true);
        return;
    }

    callback(new Error('Only JPG, PNG, WEBP, and GIF image files are allowed.'));
}

export const uploadImageMiddleware = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024,
    },
}).single('file');

export async function persistUploadedImage(file) {
    if (!file?.buffer?.length) {
        throw new Error('Image file is required.');
    }

    const detectedExtension = detectImageExtension(file.buffer);
    const expectedExtension = allowedMimeTypes.get(file.mimetype);

    if (!detectedExtension || detectedExtension !== expectedExtension) {
        throw new Error('Uploaded file content does not match a supported image type.');
    }

    const safeBaseName = sanitizeBaseName(file.originalname);
    const filename = `${Date.now()}-${safeBaseName}${detectedExtension}`;
    const destinationPath = path.join(uploadsDirectoryPath, filename);

    await writeFileAsync(destinationPath, file.buffer);

    return filename;
}

export function getManagedUploadFilename(value) {
    if (typeof value !== 'string' || !value.trim()) {
        return null;
    }

    const normalizedValue = value.trim();
    let pathname = normalizedValue;

    try {
        if (/^https?:\/\//i.test(normalizedValue)) {
            pathname = new URL(normalizedValue).pathname;
        }
    } catch {
        return null;
    }

    if (!pathname.startsWith('/uploads/')) {
        return null;
    }

    const filename = path.posix.basename(pathname);

    if (!filename || filename !== pathname.slice('/uploads/'.length)) {
        return null;
    }

    return filename;
}

export async function deleteManagedUploadByFilename(filename) {
    if (!filename) {
        return;
    }

    const uploadPath = path.join(uploadsDirectoryPath, filename);
    const resolvedUploadPath = path.resolve(uploadPath);
    const resolvedUploadsDirectoryPath = path.resolve(uploadsDirectoryPath);

    if (!resolvedUploadPath.startsWith(`${resolvedUploadsDirectoryPath}${path.sep}`)) {
        throw new Error('Refused to delete a file outside the uploads directory.');
    }

    try {
        await unlinkAsync(resolvedUploadPath);
    } catch (error) {
        if (error?.code !== 'ENOENT') {
            throw error;
        }
    }
}

export function buildUploadedFileUrl(filename) {
    return `/uploads/${filename}`;
}
