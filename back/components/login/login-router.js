import { Router } from 'express';
import { createLoginController } from './login-controller.js';
import { uploadImageMiddleware } from '../../src/upload.js';

export function createLoginRouter(authConfig, requireAdmin) {
    const router = Router();
    const loginController = createLoginController(authConfig);

    router.get('/session', loginController.getSession);
    router.get('/content', requireAdmin, loginController.getAdminContent);
    router.post('/upload-image', requireAdmin, uploadImageMiddleware, loginController.uploadImage);

    return router;
}
