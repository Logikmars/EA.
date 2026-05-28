import { appendMediaItem, deleteMediaBySlug, readAdminContent, updateMediaBySlug } from '../../src/contentStore.js';
import { mapMediaListItem, mediaSchema } from './media-model.js';

class MediaService {
    getLocale(value) {
        return value === 'en' ? 'en' : 'ua';
    }

    async getPublicMedia(localeQuery) {
        const locale = this.getLocale(localeQuery);
        const content = await readAdminContent();

        return content.media.map((mediaItem) => mapMediaListItem(mediaItem, locale));
    }

    async getAdminMedia() {
        const content = await readAdminContent();

        return content.media;
    }

    async createMedia(payload) {
        const parsedPayload = mediaSchema.parse(payload);

        return appendMediaItem(parsedPayload);
    }

    async updateMedia(slug, payload) {
        const parsedPayload = mediaSchema.parse(payload);

        return updateMediaBySlug(slug, parsedPayload);
    }

    async deleteMedia(slug) {
        return deleteMediaBySlug(slug);
    }
}

export const mediaService = new MediaService();
export default mediaService;
