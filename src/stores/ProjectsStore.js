import { getApiBaseUrl, requestJson } from '@/lib/api';
import { makeAutoObservable, runInAction } from 'mobx';

class ProjectsStore {
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

    getProjects(locale) {
        return this.itemsByLocale[locale] ?? [];
    }

    getIsLoading(locale) {
        return Boolean(this.loadingByLocale[locale]);
    }

    mergeItems(locale, initialItems, backendItems) {
        const seen = new Set();
        const mergedItems = [...backendItems, ...initialItems].filter((item) => {
            if (!item?.slug || seen.has(item.slug)) {
                return false;
            }

            seen.add(item.slug);
            return true;
        });

        this.itemsByLocale[locale] = mergedItems;
    }

    async load(locale, initialItems = []) {
        this.hydrate(locale, initialItems);
        this.loadingByLocale[locale] = true;
        this.errorByLocale[locale] = '';

        try {
            const url = new URL('/api/content/projects', getApiBaseUrl());
            url.searchParams.set('locale', locale);

            const data = await requestJson(url.toString());

            runInAction(() => {
                this.mergeItems(locale, initialItems, Array.isArray(data?.items) ? data.items : []);
            });
        } catch (error) {
            runInAction(() => {
                this.errorByLocale[locale] = error instanceof Error ? error.message : 'Unable to load projects.';
            });
        } finally {
            runInAction(() => {
                this.loadingByLocale[locale] = false;
            });
        }
    }
}

const projectsStore = new ProjectsStore();

export { ProjectsStore, projectsStore };
export default projectsStore;
