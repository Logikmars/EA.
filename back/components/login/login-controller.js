import { getAdminSession, mapSessionResponse } from './login-service.js';
import projectsService from '../projects/projects-service.js';
import mediaService from '../media/media-service.js';
import { buildAbsoluteUploadedFileUrl, persistUploadedImage } from '../../src/upload.js';

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
            const filename = await persistUploadedImage(req.file);

            return res.status(201).json({
                url: buildAbsoluteUploadedFileUrl(req, filename),
            });
        } catch (error) {
            return next(error);
        }
    };
}

export function createLoginController(authConfig) {
    return new LoginController(authConfig);
}
