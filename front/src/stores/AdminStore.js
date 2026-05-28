import { makeAutoObservable, runInAction } from 'mobx';
import {
    authFormHeaders,
    getCsrfToken,
    requestAdmin,
    requestAdminJson,
    requestAuth,
} from '@/lib/api';
import { normalizeAdminCallbackUrl } from '@/lib/adminNavigation';

class AdminStore {
    session = null;
    content = {
        projects: [],
        media: [],
    };
    isCheckingSession = false;
    isLoadingContent = false;
    isSubmitting = false;
    isUploadingFile = false;
    error = '';
    success = '';

    constructor() {
        makeAutoObservable(this);
    }

    clearError() {
        this.error = '';
    }

    clearSuccess() {
        this.success = '';
    }

    async fetchSession() {
        this.isCheckingSession = true;
        this.clearError();

        try {
            const data = await requestAdmin('/session');

            runInAction(() => {
                this.session = data.user;
            });

            return data.user;
        } catch (error) {
            runInAction(() => {
                this.session = null;
                this.error = error instanceof Error ? error.message : 'Unable to get session.';
            });

            return null;
        } finally {
            runInAction(() => {
                this.isCheckingSession = false;
            });
        }
    }

    async login({ email, password, callbackUrl = '/admin' }) {
        this.isSubmitting = true;
        this.clearError();
        const safeCallbackUrl = normalizeAdminCallbackUrl(callbackUrl);

        try {
            const csrfToken = await getCsrfToken();
            const response = await requestAuth('/callback/credentials', {
                method: 'POST',
                credentials: 'include',
                headers: authFormHeaders,
                body: new URLSearchParams({
                    email,
                    password,
                    csrfToken,
                    callbackUrl: safeCallbackUrl,
                }),
            });
            const redirectUrl = response?.url ? new URL(response.url, window.location.origin) : null;
            const authError = redirectUrl?.searchParams.get('error');

            if (authError) {
                throw new Error('Wrong email or password.');
            }

            await this.fetchSession();

            return {
                ok: true,
            };
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Sign in failed.';
            });

            return {
                ok: false,
                error: this.error,
            };
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    }

    async logout() {
        this.isSubmitting = true;
        this.clearError();

        try {
            const csrfToken = await getCsrfToken();

            await requestAuth('/signout', {
                method: 'POST',
                credentials: 'include',
                headers: authFormHeaders,
                body: new URLSearchParams({
                    csrfToken,
                    callbackUrl: '/admin/login',
                }),
            });

            runInAction(() => {
                this.session = null;
                this.content = {
                    projects: [],
                    media: [],
                };
            });
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Sign out failed.';
            });
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    }

    async loadContent() {
        this.isLoadingContent = true;
        this.clearError();
        this.clearSuccess();

        try {
            const data = await requestAdmin('/content');

            runInAction(() => {
                this.content = {
                    projects: Array.isArray(data?.projects) ? data.projects : [],
                    media: Array.isArray(data?.media) ? data.media : [],
                };
            });
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Unable to load admin content.';
            });
        } finally {
            runInAction(() => {
                this.isLoadingContent = false;
            });
        }
    }

    async createProject(payload) {
        this.isSubmitting = true;
        this.clearError();
        this.clearSuccess();

        try {
            const data = await requestAdminJson('/projects', {
                method: 'POST',
                body: payload,
            });

            runInAction(() => {
                this.content.projects = Array.isArray(data?.items) ? data.items : this.content.projects;
                this.success = 'Project created.';
            });

            return {
                ok: true,
            };
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Unable to save project.';
            });

            return {
                ok: false,
                error: this.error,
            };
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    }

    async createMedia(payload) {
        this.isSubmitting = true;
        this.clearError();
        this.clearSuccess();

        try {
            const data = await requestAdminJson('/media', {
                method: 'POST',
                body: payload,
            });

            runInAction(() => {
                this.content.media = Array.isArray(data?.items) ? data.items : this.content.media;
                this.success = 'Media item created.';
            });

            return {
                ok: true,
            };
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Unable to save media item.';
            });

            return {
                ok: false,
                error: this.error,
            };
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    }

    async updateProject(currentSlug, payload) {
        this.isSubmitting = true;
        this.clearError();
        this.clearSuccess();

        try {
            const data = await requestAdminJson(`/projects/${encodeURIComponent(currentSlug)}`, {
                method: 'PUT',
                body: payload,
            });

            runInAction(() => {
                this.content.projects = Array.isArray(data?.items) ? data.items : this.content.projects;
                this.success = 'Project updated.';
            });

            return { ok: true };
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Unable to update project.';
            });

            return { ok: false, error: this.error };
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    }

    async deleteProject(slug) {
        this.isSubmitting = true;
        this.clearError();
        this.clearSuccess();

        try {
            const data = await requestAdmin(`/projects/${encodeURIComponent(slug)}`, {
                method: 'DELETE',
            });

            runInAction(() => {
                this.content.projects = Array.isArray(data?.items) ? data.items : this.content.projects;
                this.success = 'Project deleted.';
            });

            return { ok: true };
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Unable to delete project.';
            });

            return { ok: false, error: this.error };
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    }

    async updateMedia(currentSlug, payload) {
        this.isSubmitting = true;
        this.clearError();
        this.clearSuccess();

        try {
            const data = await requestAdminJson(`/media/${encodeURIComponent(currentSlug)}`, {
                method: 'PUT',
                body: payload,
            });

            runInAction(() => {
                this.content.media = Array.isArray(data?.items) ? data.items : this.content.media;
                this.success = 'Media item updated.';
            });

            return { ok: true };
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Unable to update media item.';
            });

            return { ok: false, error: this.error };
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    }

    async deleteMedia(slug) {
        this.isSubmitting = true;
        this.clearError();
        this.clearSuccess();

        try {
            const data = await requestAdmin(`/media/${encodeURIComponent(slug)}`, {
                method: 'DELETE',
            });

            runInAction(() => {
                this.content.media = Array.isArray(data?.items) ? data.items : this.content.media;
                this.success = 'Media item deleted.';
            });

            return { ok: true };
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Unable to delete media item.';
            });

            return { ok: false, error: this.error };
        } finally {
            runInAction(() => {
                this.isSubmitting = false;
            });
        }
    }

    async uploadImage(file) {
        this.isUploadingFile = true;
        this.clearError();
        this.clearSuccess();

        try {
            const formData = new FormData();
            formData.append('file', file);

            const data = await requestAdmin('/upload-image', {
                method: 'POST',
                body: formData,
            });

            return {
                ok: true,
                url: data?.url || '',
            };
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Unable to upload image.';
            });

            return {
                ok: false,
                error: this.error,
                url: '',
            };
        } finally {
            runInAction(() => {
                this.isUploadingFile = false;
            });
        }
    }
}

const adminStore = new AdminStore();

export { AdminStore, adminStore };
export default adminStore;
