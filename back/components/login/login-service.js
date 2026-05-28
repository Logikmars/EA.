import { createHash, timingSafeEqual } from 'node:crypto';
import { getSession } from '@auth/express';
import { buildAdminUser, buildSessionPayload, normalizeEmail, normalizePassword } from './login-model.js';

function hashValue(value) {
    return createHash('sha256').update(String(value)).digest();
}

function safeCompare(left, right) {
    return timingSafeEqual(hashValue(left), hashValue(right));
}

export function authorizeAdmin(credentials) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const email = normalizeEmail(credentials?.email);
    const password = normalizePassword(credentials?.password);

    if (!adminEmail || !adminPassword || !email || !password) {
        return null;
    }

    const isValidEmail = safeCompare(email, normalizeEmail(adminEmail));
    const isValidPassword = safeCompare(password, adminPassword);

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
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        throw error;
    }

    return session;
}

export function mapSessionResponse(session) {
    return buildSessionPayload(session);
}
