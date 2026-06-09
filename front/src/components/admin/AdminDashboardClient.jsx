'use client';

import { observer } from 'mobx-react-lite';
import { startTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import adminStore from '@/stores/AdminStore';
import ImageDropzone from './ImageDropzone';

function normalizeText(value) {
    return String(value ?? '').trim();
}

const emptyProjectForm = {
    img: '',
    href: '',
    categoryUa: '',
    categoryEn: '',
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

function updateFormValue(setForm, field, value) {
    setForm((currentValue) => ({
        ...currentValue,
        [field]: value,
    }));
}

function clearAdminMessages() {
    adminStore.clearError();
    adminStore.clearSuccess();
}

const AdminDashboardClient = observer(() => {
    const router = useRouter();
    const [projectForm, setProjectForm] = useState(emptyProjectForm);
    const [mediaForm, setMediaForm] = useState(emptyMediaForm);
    const [editingProjectHref, setEditingProjectHref] = useState('');
    const [editingMediaSourceUrl, setEditingMediaSourceUrl] = useState('');

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

    const createFieldUpdater = (setForm) => (field) => (event) => {
        updateFormValue(setForm, field, event.target.value);
    };

    const createImageUpdater = (setForm) => (url) => {
        updateFormValue(setForm, 'img', url);
    };

    const createCancelEditHandler = (setEditingSlug, setForm, emptyForm) => () => {
        setEditingSlug('');
        setForm(emptyForm);
        clearAdminMessages();
    };

    const createStartEditHandler = (setEditingSlug, setForm, mapItemToForm) => (item) => {
        setEditingSlug(item.href || item.sourceUrl || '');
        setForm(mapItemToForm(item));
        clearAdminMessages();
    };

    const createSubmitHandler = ({
        form,
        editingKey,
        setEditingSlug,
        setForm,
        emptyForm,
        createAction,
        updateAction,
        buildPayload,
    }) => async (event) => {
        event.preventDefault();

        const payload = buildPayload(form);
        const result = editingKey ? await updateAction(editingKey, payload) : await createAction(payload);

        if (result.ok) {
            setForm(emptyForm);
            setEditingSlug('');
        }
    };

    const createDeleteHandler = ({
        confirmMessage,
        deleteAction,
        editingKey,
        cancelEdit,
    }) => async (key) => {
        const isConfirmed = window.confirm(confirmMessage);

        if (!isConfirmed) {
            return;
        }

        const result = await deleteAction(key);

        if (result.ok && editingKey === key) {
            cancelEdit();
        }
    };

    const updateProjectField = createFieldUpdater(setProjectForm);
    const updateMediaField = createFieldUpdater(setMediaForm);
    const updateProjectImage = createImageUpdater(setProjectForm);
    const updateMediaImage = createImageUpdater(setMediaForm);

    const cancelProjectEdit = createCancelEditHandler(setEditingProjectHref, setProjectForm, emptyProjectForm);
    const cancelMediaEdit = createCancelEditHandler(setEditingMediaSourceUrl, setMediaForm, emptyMediaForm);

    const startProjectEdit = createStartEditHandler(setEditingProjectHref, setProjectForm, (project) => ({
        img: project.img || '',
        href: project.href || '',
        categoryUa: project.category?.ua || '',
        categoryEn: project.category?.en || '',
        titleUa: project.title?.ua || '',
        titleEn: project.title?.en || '',
        summaryUa: project.summary?.ua || '',
        summaryEn: project.summary?.en || '',
    }));

    const startMediaEdit = createStartEditHandler(setEditingMediaSourceUrl, setMediaForm, (mediaItem) => ({
        img: mediaItem.img || '',
        typeUa: mediaItem.type?.ua || '',
        typeEn: mediaItem.type?.en || '',
        titleUa: mediaItem.title?.ua || '',
        titleEn: mediaItem.title?.en || '',
        sourceUrl: mediaItem.sourceUrl || '',
        summaryUa: mediaItem.summary?.ua || '',
        summaryEn: mediaItem.summary?.en || '',
    }));

    const handleProjectSubmit = createSubmitHandler({
        form: projectForm,
        editingKey: editingProjectHref,
        setEditingSlug: setEditingProjectHref,
        setForm: setProjectForm,
        emptyForm: emptyProjectForm,
        createAction: (payload) => adminStore.createProject(payload),
        updateAction: (href, payload) => adminStore.updateProject(href, payload),
        buildPayload: (currentForm) => ({
            img: normalizeText(currentForm.img) || '/imgs/projects/1.png',
            href: normalizeText(currentForm.href),
            category: {
                ua: normalizeText(currentForm.categoryUa),
                en: normalizeText(currentForm.categoryEn),
            },
            title: {
                ua: normalizeText(currentForm.titleUa),
                en: normalizeText(currentForm.titleEn),
            },
            summary: {
                ua: normalizeText(currentForm.summaryUa),
                en: normalizeText(currentForm.summaryEn),
            },
        }),
    });

    const handleMediaSubmit = createSubmitHandler({
        form: mediaForm,
        editingKey: editingMediaSourceUrl,
        setEditingSlug: setEditingMediaSourceUrl,
        setForm: setMediaForm,
        emptyForm: emptyMediaForm,
        createAction: (payload) => adminStore.createMedia(payload),
        updateAction: (sourceUrl, payload) => adminStore.updateMedia(sourceUrl, payload),
        buildPayload: (currentForm) => ({
            img: normalizeText(currentForm.img) || '/imgs/projects/1.png',
            type: {
                ua: normalizeText(currentForm.typeUa),
                en: normalizeText(currentForm.typeEn),
            },
            title: {
                ua: normalizeText(currentForm.titleUa),
                en: normalizeText(currentForm.titleEn),
            },
            summary: {
                ua: normalizeText(currentForm.summaryUa),
                en: normalizeText(currentForm.summaryEn),
            },
            outlet: '',
            sourceUrl: normalizeText(currentForm.sourceUrl),
        }),
    });

    const handleProjectDelete = createDeleteHandler({
        confirmMessage: 'Delete this project?',
        deleteAction: (href) => adminStore.deleteProject(href),
        editingKey: editingProjectHref,
        cancelEdit: cancelProjectEdit,
    });

    const handleMediaDelete = createDeleteHandler({
        confirmMessage: 'Delete this media item?',
        deleteAction: (sourceUrl) => adminStore.deleteMedia(sourceUrl),
        editingKey: editingMediaSourceUrl,
        cancelEdit: cancelMediaEdit,
    });

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
                    <div className='AdminEyebrow'>Admin</div>
                    <h1>Please wait...</h1>
                </section>
            </main>
        );
    }

    return (
        <main className='AdminShell'>
            <section className='AdminPanel'>
                <div className='AdminTopbar'>
                    <div>
                        <div className='AdminEyebrow'>EA Admin</div>
                        <h1>Dashboard</h1>
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
                            <h2>{editingProjectHref ? 'Edit project' : 'New project'}</h2>
                            <span>{adminStore.content.projects.length} items</span>
                        </div>
                        <form className='AdminForm' onSubmit={handleProjectSubmit}>
                            <ImageDropzone
                                label='Project image'
                                onUploaded={updateProjectImage}
                                value={projectForm.img}
                            />
                            <label className='AdminField'>
                                <span>Link</span>
                                <input name='href' onChange={updateProjectField('href')} required type='url' value={projectForm.href} />
                            </label>
                            <label className='AdminField'>
                                <span>Category UA</span>
                                <input name='categoryUa' onChange={updateProjectField('categoryUa')} required type='text' value={projectForm.categoryUa} />
                            </label>
                            <label className='AdminField'>
                                <span>Category EN</span>
                                <input name='categoryEn' onChange={updateProjectField('categoryEn')} required type='text' value={projectForm.categoryEn} />
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
                                    {adminStore.isSubmitting ? 'Saving...' : editingProjectHref ? 'Update project' : 'Add project'}
                                </button>
                                {editingProjectHref ? (
                                    <button className='AdminButton AdminButton__secondary' onClick={cancelProjectEdit} type='button'>
                                        Cancel
                                    </button>
                                ) : null}
                            </div>
                        </form>

                        <div className='AdminList'>
                            {adminStore.content.projects.map((project) => (
                                <article className='AdminListItem' key={project.href}>
                                    <div className='AdminListItemMain'>
                                        <strong>{project.title?.en || project.title?.ua || 'Untitled project'}</strong>
                                        <span>{project.href}</span>
                                    </div>
                                    <div className='AdminListItemActions'>
                                        <button className='AdminButton AdminButton__secondary AdminButton__small' onClick={() => startProjectEdit(project)} type='button'>
                                            Edit
                                        </button>
                                        <button className='AdminButton AdminButton__danger AdminButton__small' onClick={() => handleProjectDelete(project.href)} type='button'>
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className='AdminCard' id='media'>
                        <div className='AdminCardHeader'>
                            <h2>{editingMediaSourceUrl ? 'Edit media' : 'New media'}</h2>
                            <span>{adminStore.content.media.length} items</span>
                        </div>
                        <form className='AdminForm' onSubmit={handleMediaSubmit}>
                            <ImageDropzone
                                label='Media image'
                                onUploaded={updateMediaImage}
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
                                    {adminStore.isSubmitting ? 'Saving...' : editingMediaSourceUrl ? 'Update media' : 'Add media'}
                                </button>
                                {editingMediaSourceUrl ? (
                                    <button className='AdminButton AdminButton__secondary' onClick={cancelMediaEdit} type='button'>
                                        Cancel
                                    </button>
                                ) : null}
                            </div>
                        </form>

                        <div className='AdminList'>
                            {adminStore.content.media.map((mediaItem) => (
                                <article className='AdminListItem' key={mediaItem.sourceUrl}>
                                    <div className='AdminListItemMain'>
                                        <strong>{mediaItem.title?.en || mediaItem.title?.ua || 'Untitled media item'}</strong>
                                        <span>{mediaItem.sourceUrl}</span>
                                    </div>
                                    <div className='AdminListItemActions'>
                                        <button className='AdminButton AdminButton__secondary AdminButton__small' onClick={() => startMediaEdit(mediaItem)} type='button'>
                                            Edit
                                        </button>
                                        <button className='AdminButton AdminButton__danger AdminButton__small' onClick={() => handleMediaDelete(mediaItem.sourceUrl)} type='button'>
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
