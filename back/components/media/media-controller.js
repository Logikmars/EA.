import mediaService from './media-service.js';

class MediaController {
    getPublicMedia = async (req, res, next) => {
        try {
            const items = await mediaService.getPublicMedia(req.query.locale);

            return res.json({ items });
        } catch (error) {
            return next(error);
        }
    };

    createMedia = async (req, res, next) => {
        try {
            const items = await mediaService.createMedia(req.body);

            return res.status(201).json({ items });
        } catch (error) {
            return next(error);
        }
    };

    updateMedia = async (req, res, next) => {
        try {
            const items = await mediaService.updateMedia(req.params.sourceUrl, req.body);

            return res.json({ items });
        } catch (error) {
            return next(error);
        }
    };

    deleteMedia = async (req, res, next) => {
        try {
            const items = await mediaService.deleteMedia(req.params.sourceUrl);

            return res.json({ items });
        } catch (error) {
            return next(error);
        }
    };
}

export const mediaController = new MediaController();
export default mediaController;
