import { getAdminSession, mapSessionResponse } from './login-service.js';
import projectsService from '../projects/projects-service.js';
import mediaService from '../media/media-service.js';
import { buildUploadedFileUrl } from '../../src/upload.js';

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
            if (!req.file?.filename) {
                throw new Error('Image file is required.');
            }

            return res.status(201).json({
                url: buildUploadedFileUrl(req, req.file.filename),
            });
        } catch (error) {
            return next(error);
        }
    };
}

export function createLoginController(authConfig) {
    return new LoginController(authConfig);
}
