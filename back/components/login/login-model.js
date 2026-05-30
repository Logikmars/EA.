export function normalizeEmail(value) {
    return String(value ?? '').trim().toLowerCase();
}

export function normalizePassword(value) {
    return String(value ?? '');
}

export function normalizeOtp(value) {
    return String(value ?? '').replace(/\s+/g, '').trim();
}

export function buildAdminUser(email) {
    return {
        id: 'admin',
        name: 'Admin',
        email,
        role: 'admin',
    };
}

export function buildSessionPayload(session) {
    return {
        authenticated: Boolean(session?.user),
        user: session?.user ?? null,
    };
}
