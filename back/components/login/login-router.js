import { Router } from 'express';
import { createLoginController } from './login-controller.js';
import { uploadImageMiddleware } from '../../src/upload.js';
import { createRateLimit } from '../../src/rateLimit.js';

export function createLoginRouter(authConfig, requireAdmin) {
    const router = Router();
    const loginController = createLoginController(authConfig);
    const uploadRateLimit = createRateLimit({
        limit: 20,
        windowMs: 15 * 60 * 1000,
        keyPrefix: 'admin-upload',
        message: 'Too many upload attempts. Please try again later.',
    });

    router.get('/session', loginController.getSession);
    router.get('/content', requireAdmin, loginController.getAdminContent);
    router.post('/upload-image', requireAdmin, uploadRateLimit, uploadImageMiddleware, loginController.uploadImage);

    return router;
}
