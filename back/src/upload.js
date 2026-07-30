import multer from 'multer';
import { createHttpError } from './httpError.js';
import { uploadFileToR2 } from './r2.js';
const allowedMimeTypes = new Map([
    ['image/jpeg', '.jpg'],
    ['image/png', '.png'],
    ['image/webp', '.webp'],
    ['image/gif', '.gif'],
]);

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

    callback(createHttpError(400, 'Only JPG, PNG, WEBP, and GIF image files are allowed.'));
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
        throw createHttpError(400, 'Image file is required.');
    }

    const detectedExtension = detectImageExtension(file.buffer);
    const expectedExtension = allowedMimeTypes.get(file.mimetype);

    if (!detectedExtension || detectedExtension !== expectedExtension) {
        throw createHttpError(400, 'Uploaded file content does not match a supported image type.');
    }

    return uploadFileToR2(file);
}
