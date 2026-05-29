import { createHash, timingSafeEqual } from 'node:crypto';
import { getSession } from '@auth/express';
import { buildAdminUser, buildSessionPayload, normalizeEmail, normalizePassword } from './login-model.js';
import { verifyPassword } from '../../src/passwordHash.js';
import { createHttpError } from '../../src/httpError.js';

function hashValue(value) {
    return createHash('sha256').update(String(value)).digest();
}

function safeCompare(left, right) {
    return timingSafeEqual(hashValue(left), hashValue(right));
}

export function authorizeAdmin(credentials) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const email = normalizeEmail(credentials?.email);
    const password = normalizePassword(credentials?.password);

    if (!adminEmail || !adminPasswordHash || !email || !password) {
        return null;
    }

    const isValidEmail = safeCompare(email, normalizeEmail(adminEmail));
    const isValidPassword = verifyPassword(password, adminPasswordHash);

    if (!isValidEmail || !isValidPassword) {
        return null;
    }

    return buildAdminUser(adminEmail);
}

export async function getAdminSession(req, authConfig) {
    return getSession(req, authConfig);
}

export async function ensureAdminSession(req, authConfig) {
    const session = await getAdminSession(req, authConfig);

    if (!session?.user) {
        throw createHttpError(401, 'Unauthorized');
    }

    return session;
}

export function mapSessionResponse(session) {
    return buildSessionPayload(session);
}
