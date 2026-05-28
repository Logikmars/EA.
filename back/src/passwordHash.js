import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SCRYPT_KEY_LENGTH = 64;
const HASH_ENCODING = 'hex';
const HASH_PREFIX = 'scrypt';

function toBuffer(value) {
    return Buffer.from(value, HASH_ENCODING);
}

export function hashPassword(password) {
    const salt = randomBytes(16);
    const derivedKey = scryptSync(password, salt, SCRYPT_KEY_LENGTH);

    return `${HASH_PREFIX}$${salt.toString(HASH_ENCODING)}$${derivedKey.toString(HASH_ENCODING)}`;
}

export function verifyPassword(password, storedHash) {
    if (typeof storedHash !== 'string') {
        return false;
    }

    const [prefix, saltHex, hashHex] = storedHash.split('$');

    if (prefix !== HASH_PREFIX || !saltHex || !hashHex) {
        return false;
    }

    const salt = toBuffer(saltHex);
    const expectedHash = toBuffer(hashHex);
    const actualHash = scryptSync(password, salt, expectedHash.length);

    return timingSafeEqual(actualHash, expectedHash);
}
