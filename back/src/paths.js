import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFilePath = fileURLToPath(import.meta.url);
const srcDirectoryPath = path.dirname(currentFilePath);
const backendRootPath = path.resolve(srcDirectoryPath, '..');

export const uploadsDirectoryPath = path.join(backendRootPath, 'uploads');
