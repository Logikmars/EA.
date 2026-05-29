export function createHttpError(statusCode, message, options = {}) {
    const error = new Error(message);

    error.statusCode = statusCode;
    error.expose = options.expose ?? statusCode < 500;

    return error;
}

export function isHttpError(error) {
    return Boolean(
        error
        && typeof error === 'object'
        && Number.isInteger(error.statusCode)
        && error.statusCode >= 400
    );
}
