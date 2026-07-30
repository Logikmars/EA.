import { getAdminSession, initiateAdminLogin, mapSessionResponse } from './login-service.js';
import projectsService from '../projects/projects-service.js';
import mediaService from '../media/media-service.js';
import { persistUploadedImage } from '../../src/upload.js';
import { createHttpError } from '../../src/httpError.js';

class LoginController {
    constructor(authConfig) {
        this.authConfig = authConfig;
    }

    getSession = async (req, res, next) => {
        try {
            const session = await getAdminSession(req, this.authConfig);

            return res.json(mapSessionResponse(session));
        } catch (error) {
            return next(error);
        }
    };

    initiateLogin = async (req, res, next) => {
        try {
            const result = await initiateAdminLogin(req.body);

            if (!result) {
                throw createHttpError(401, 'Wrong email or password.');
            }

            return res.json(result);
        } catch (error) {
            return next(error);
        }
    };

    getAdminContent = async (req, res, next) => {
        try {
            const [projects, media] = await Promise.all([
                projectsService.getAdminProjects(),
                mediaService.getAdminMedia(),
            ]);

            return res.json({
                projects,
                media,
            });
        } catch (error) {
            return next(error);
        }
    };

    uploadImage = async (req, res, next) => {
        try {
            const uploadedImage = await persistUploadedImage(req.file);

            return res.status(201).json(uploadedImage);
        } catch (error) {
            return next(error);
        }
    };
}

export function createLoginController(authConfig) {
    return new LoginController(authConfig);
}
