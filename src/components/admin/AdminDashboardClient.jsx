'use client';

import { observer } from 'mobx-react-lite';
import { startTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import adminStore from '@/stores/AdminStore';
import ImageDropzone from './ImageDropzone';

function normalizeText(value) {
    return String(value ?? '').trim();
}

function normalizeSlug(value) {
    return normalizeText(value)
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '');
}

const emptyProjectForm = {
    img: '',
    href: '',
    titleUa: '',
    titleEn: '',
    summaryUa: '',
    summaryEn: '',
};

const emptyMediaForm = {
    img: '',
    typeUa: '',
    typeEn: '',
    titleUa: '',
    titleEn: '',
    sourceUrl: '',
    summaryUa: '',
    summaryEn: '',
};

const AdminDashboardClient = observer(() => {
    const router = useRouter();
    const [projectForm, setProjectForm] = useState(emptyProjectForm);
    const [mediaForm, setMediaForm] = useState(emptyMediaForm);
    const [editingProjectSlug, setEditingProjectSlug] = useState('');
    const [editingMediaSlug, setEditingMediaSlug] = useState('');

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            const session = await adminStore.fetchSession();

            if (!isMounted) {
                return;
            }

            if (!session) {
                startTransition(() => {
                    router.replace('/admin/login?callbackUrl=/admin');
                });

                return;
            }

            await adminStore.loadContent();
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [router]);

    const updateProjectField = (field) => (event) => {
        const value = event.target.value;

        setProjectForm((currentValue) => ({
            ...currentValue,
            [field]: value,
        }));
    };

    const updateMediaField = (field) => (event) => {
        const value = event.target.value;

        setMediaForm((currentValue) => ({
            ...currentValue,
            [field]: value,
        }));
    };

    const handleProjectSubmit = async (event) => {
        event.preventDefault();

        const generatedSlug = normalizeSlug(projectForm.titleEn || projectForm.href);
        const payload = {
            slug: generatedSlug,
            img: normalizeText(projectForm.img) || '/imgs/projects/1.png',
            href: normalizeText(projectForm.href),
            title: {
                ua: normalizeText(projectForm.titleUa),
                en: normalizeText(projectForm.titleEn),
            },
            summary: {
                ua: normalizeText(projectForm.summaryUa),
                en: normalizeText(projectForm.summaryEn),
            },
            tags: [],
        };
        const result = editingProjectSlug
            ? await adminStore.updateProject(editingProjectSlug, payload)
            : await adminStore.createProject(payload);

        if (result.ok) {
            setProjectForm(emptyProjectForm);
            setEditingProjectSlug('');
        }
    };

    const handleMediaSubmit = async (event) => {
        event.preventDefault();

        const generatedSlug = normalizeSlug(mediaForm.titleEn || mediaForm.sourceUrl);
        const payload = {
            slug: generatedSlug,
            img: normalizeText(mediaForm.img) || '/imgs/projects/1.png',
            type: {
                ua: normalizeText(mediaForm.typeUa),
                en: normalizeText(mediaForm.typeEn),
            },
            title: {
                ua: normalizeText(mediaForm.titleUa),
                en: normalizeText(mediaForm.titleEn),
            },
            summary: {
                ua: normalizeText(mediaForm.summaryUa),
                en: normalizeText(mediaForm.summaryEn),
            },
            outlet: '',
            sourceUrl: normalizeText(mediaForm.sourceUrl),
        };
        const result = editingMediaSlug
            ? await adminStore.updateMedia(editingMediaSlug, payload)
            : await adminStore.createMedia(payload);

        if (result.ok) {
            setMediaForm(emptyMediaForm);
            setEditingMediaSlug('');
        }
    };

    const startProjectEdit = (project) => {
        setEditingProjectSlug(project.slug);
        setProjectForm({
            img: project.img || '',
            href: project.href || '',
            titleUa: project.title?.ua || '',
            titleEn: project.title?.en || '',
            summaryUa: project.summary?.ua || '',
            summaryEn: project.summary?.en || '',
        });
        adminStore.clearError();
        adminStore.clearSuccess();
    };

    const startMediaEdit = (mediaItem) => {
        setEditingMediaSlug(mediaItem.slug);
        setMediaForm({
            img: mediaItem.img || '',
            typeUa: mediaItem.type?.ua || '',
            typeEn: mediaItem.type?.en || '',
            titleUa: mediaItem.title?.ua || '',
            titleEn: mediaItem.title?.en || '',
            sourceUrl: mediaItem.sourceUrl || '',
            summaryUa: mediaItem.summary?.ua || '',
            summaryEn: mediaItem.summary?.en || '',
        });
        adminStore.clearError();
        adminStore.clearSuccess();
    };

    const cancelProjectEdit = () => {
        setEditingProjectSlug('');
        setProjectForm(emptyProjectForm);
        adminStore.clearError();
        adminStore.clearSuccess();
    };

    const cancelMediaEdit = () => {
        setEditingMediaSlug('');
        setMediaForm(emptyMediaForm);
        adminStore.clearError();
        adminStore.clearSuccess();
    };

    const handleProjectDelete = async (slug) => {
        const isConfirmed = window.confirm('Delete this project?');

        if (!isConfirmed) {
            return;
        }

        const result = await adminStore.deleteProject(slug);

        if (result.ok && editingProjectSlug === slug) {
            cancelProjectEdit();
        }
    };

    const handleMediaDelete = async (slug) => {
        const isConfirmed = window.confirm('Delete this media item?');

        if (!isConfirmed) {
            return;
        }

        const result = await adminStore.deleteMedia(slug);

        if (result.ok && editingMediaSlug === slug) {
            cancelMediaEdit();
        }
    };

    const handleLogout = async () => {
        await adminStore.logout();
        startTransition(() => {
            router.replace('/admin/login');
        });
    };

    if (adminStore.isCheckingSession) {
        return (
            <main className='AdminShell'>
                <section className='AdminLoginCard'>
                    <div className='AdminEyebrow'>Admin Access</div>
                    <h1>Checking session...</h1>
                </section>
            </main>
        );
    }

    return (
        <main className='AdminShell'>
            <section className='AdminPanel'>
                <div className='AdminTopbar'>
                    <div>
                        <div className='AdminEyebrow'>Art Nation Admin</div>
                        <h1>Content dashboard</h1>
                        <p>All admin data and auth logic now live in the `back` Express service.</p>
                    </div>
                    <button className='AdminButton AdminButton__secondary' onClick={handleLogout} type='button'>
                        Sign out
                    </button>
                </div>

                {adminStore.error ? <div className='AdminAlert AdminAlert__error'>{adminStore.error}</div> : null}
                {adminStore.success ? <div className='AdminAlert AdminAlert__success'>{adminStore.success}</div> : null}

                <div className='AdminGrid'>
                    <section className='AdminCard' id='projects'>
                        <div className='AdminCardHeader'>
                            <h2>{editingProjectSlug ? 'Edit project' : 'New project'}</h2>
                            <span>{adminStore.content.projects.length} custom items</span>
                        </div>
                        <form className='AdminForm' onSubmit={handleProjectSubmit}>
                            <ImageDropzone
                                label='Project image'
                                onUploaded={(url) => setProjectForm((currentValue) => ({ ...currentValue, img: url }))}
                                value={projectForm.img}
                            />
                            <label className='AdminField'>
                                <span>Link</span>
                                <input name='href' onChange={updateProjectField('href')} required type='url' value={projectForm.href} />
                            </label>
                            <label className='AdminField'>
                                <span>Title UA</span>
                                <input name='titleUa' onChange={updateProjectField('titleUa')} required type='text' value={projectForm.titleUa} />
                            </label>
                            <label className='AdminField'>
                                <span>Title EN</span>
                                <input name='titleEn' onChange={updateProjectField('titleEn')} required type='text' value={projectForm.titleEn} />
                            </label>
                            <label className='AdminField'>
                                <span>Text UA</span>
                                <textarea name='summaryUa' onChange={updateProjectField('summaryUa')} rows='4' value={projectForm.summaryUa} />
                            </label>
                            <label className='AdminField'>
                                <span>Text EN</span>
                                <textarea name='summaryEn' onChange={updateProjectField('summaryEn')} rows='4' value={projectForm.summaryEn} />
                            </label>
                            <div className='AdminActionsRow'>
                                <button className='AdminButton' disabled={adminStore.isSubmitting} type='submit'>
                                    {adminStore.isSubmitting ? 'Saving...' : editingProjectSlug ? 'Update project' : 'Add project'}
                                </button>
                                {editingProjectSlug ? (
                                    <button className='AdminButton AdminButton__secondary' onClick={cancelProjectEdit} type='button'>
                                        Cancel
                                    </button>
                                ) : null}
                            </div>
                        </form>

                        <div className='AdminList'>
                            {adminStore.content.projects.map((project) => (
                                <article className='AdminListItem' key={project.slug}>
                                    <div className='AdminListItemMain'>
                                        <strong>{project.title?.en || project.title?.ua || 'Untitled project'}</strong>
                                        <span>{project.href}</span>
                                    </div>
                                    <div className='AdminListItemActions'>
                                        <button className='AdminButton AdminButton__secondary AdminButton__small' onClick={() => startProjectEdit(project)} type='button'>
                                            Edit
                                        </button>
                                        <button className='AdminButton AdminButton__danger AdminButton__small' onClick={() => handleProjectDelete(project.slug)} type='button'>
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className='AdminCard' id='media'>
                        <div className='AdminCardHeader'>
                            <h2>{editingMediaSlug ? 'Edit media item' : 'New media item'}</h2>
                            <span>{adminStore.content.media.length} custom items</span>
                        </div>
                        <form className='AdminForm' onSubmit={handleMediaSubmit}>
                            <ImageDropzone
                                label='Media image'
                                onUploaded={(url) => setMediaForm((currentValue) => ({ ...currentValue, img: url }))}
                                value={mediaForm.img}
                            />
                            <label className='AdminField'>
                                <span>Type UA</span>
                                <input name='typeUa' onChange={updateMediaField('typeUa')} required type='text' value={mediaForm.typeUa} />
                            </label>
                            <label className='AdminField'>
                                <span>Type EN</span>
                                <input name='typeEn' onChange={updateMediaField('typeEn')} required type='text' value={mediaForm.typeEn} />
                            </label>
                            <label className='AdminField'>
                                <span>Title UA</span>
                                <input name='titleUa' onChange={updateMediaField('titleUa')} required type='text' value={mediaForm.titleUa} />
                            </label>
                            <label className='AdminField'>
                                <span>Title EN</span>
                                <input name='titleEn' onChange={updateMediaField('titleEn')} required type='text' value={mediaForm.titleEn} />
                            </label>
                            <label className='AdminField'>
                                <span>Text UA</span>
                                <textarea name='summaryUa' onChange={updateMediaField('summaryUa')} rows='4' value={mediaForm.summaryUa} />
                            </label>
                            <label className='AdminField'>
                                <span>Text EN</span>
                                <textarea name='summaryEn' onChange={updateMediaField('summaryEn')} rows='4' value={mediaForm.summaryEn} />
                            </label>
                            <label className='AdminField'>
                                <span>Source URL</span>
                                <input name='sourceUrl' onChange={updateMediaField('sourceUrl')} required type='url' value={mediaForm.sourceUrl} />
                            </label>
                            <div className='AdminActionsRow'>
                                <button className='AdminButton' disabled={adminStore.isSubmitting} type='submit'>
                                    {adminStore.isSubmitting ? 'Saving...' : editingMediaSlug ? 'Update media item' : 'Add media item'}
                                </button>
                                {editingMediaSlug ? (
                                    <button className='AdminButton AdminButton__secondary' onClick={cancelMediaEdit} type='button'>
                                        Cancel
                                    </button>
                                ) : null}
                            </div>
                        </form>

                        <div className='AdminList'>
                            {adminStore.content.media.map((mediaItem) => (
                                <article className='AdminListItem' key={mediaItem.slug}>
                                    <div className='AdminListItemMain'>
                                        <strong>{mediaItem.title?.en || mediaItem.title?.ua || 'Untitled media item'}</strong>
                                        <span>{mediaItem.sourceUrl}</span>
                                    </div>
                                    <div className='AdminListItemActions'>
                                        <button className='AdminButton AdminButton__secondary AdminButton__small' onClick={() => startMediaEdit(mediaItem)} type='button'>
                                            Edit
                                        </button>
                                        <button className='AdminButton AdminButton__danger AdminButton__small' onClick={() => handleMediaDelete(mediaItem.slug)} type='button'>
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </section>
        </main>
    );
});

export default AdminDashboardClient;
