import { getApiBaseUrl, requestJson } from '@/lib/api';
import { makeAutoObservable, runInAction } from 'mobx';

class MediaStore {
    itemsByLocale = {};
    loadingByLocale = {};
    errorByLocale = {};

    constructor() {
        makeAutoObservable(this);
    }

    hydrate(locale, items = []) {
        if (!Array.isArray(items) || this.itemsByLocale[locale]?.length) {
            return;
        }

        this.itemsByLocale[locale] = items;
    }

    getMedia(locale) {
        return this.itemsByLocale[locale] ?? [];
    }

    getIsLoading(locale) {
        return Boolean(this.loadingByLocale[locale]);
    }

    async load(locale, initialItems = []) {
        this.hydrate(locale, initialItems);
        this.loadingByLocale[locale] = true;
        this.errorByLocale[locale] = '';

        try {
            const url = new URL('/api/content/media', getApiBaseUrl());
            url.searchParams.set('locale', locale);

            const data = await requestJson(url.toString());

            runInAction(() => {
                this.itemsByLocale[locale] = Array.isArray(data?.items) ? data.items : [];
            });
        } catch (error) {
            runInAction(() => {
                this.errorByLocale[locale] = error instanceof Error ? error.message : 'Unable to load media.';
            });
        } finally {
            runInAction(() => {
                this.loadingByLocale[locale] = false;
            });
        }
    }

}

const mediaStore = new MediaStore();

export { MediaStore, mediaStore };
export default mediaStore;
