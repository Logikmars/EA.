import { existsSync } from 'node:fs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const uploadsDirectoryPath = path.join(process.cwd(), 'uploads');

if (!existsSync(uploadsDirectoryPath)) {
    mkdirSync(uploadsDirectoryPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadsDirectoryPath);
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
        const safeBaseName = path.basename(file.originalname || 'upload', extension)
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/-{2,}/g, '-')
            .replace(/^-|-$/g, '') || 'upload';

        callback(null, `${Date.now()}-${safeBaseName}${extension}`);
    },
});

function fileFilter(req, file, callback) {
    if (file.mimetype?.startsWith('image/')) {
        callback(null, true);
        return;
    }

    callback(new Error('Only image files are allowed.'));
}

export const uploadImageMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024,
    },
}).single('file');

export function buildUploadedFileUrl(req, filename) {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}
