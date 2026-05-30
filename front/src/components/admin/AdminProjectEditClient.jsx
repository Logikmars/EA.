'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageShell from './AdminPageShell';
import ImageDropzone from './ImageDropzone';
import adminStore from '@/stores/AdminStore';
import {
    buildProjectPayload,
    emptyProjectForm,
    mapProjectToForm,
    updateFormValue,
} from './adminFormUtils';

const AdminProjectEditClient = observer(({ slug }) => {
    const router = useRouter();
    const [form, setForm] = useState(emptyProjectForm);
    const [isLoaded, setIsLoaded] = useState(false);
    const project = adminStore.content.projects.find((item) => item.slug === slug);

    useEffect(() => {
        if (project) {
            setForm(mapProjectToForm(project));
        }

        setIsLoaded(true);
    }, [project, slug]);

    const updateField = (field) => (event) => {
        updateFormValue(setForm, field, event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = buildProjectPayload(form);
        const result = await adminStore.updateProject(slug, payload);

        if (result.ok) {
            const updatedProject = adminStore.content.projects.find((item) => item.slug === payload.slug);

            if (updatedProject) {
                setForm(mapProjectToForm(updatedProject));
            }

            if (payload.slug !== slug) {
                router.replace(`/admin/projects/${payload.slug}`);
            }
        }
    };

    return (
        <AdminPageShell loadContent title='Edit project'>
            <section className='AdminCard'>
                {!isLoaded || adminStore.isLoadingContent ? (
                    <div className='AdminEmptyState'>Loading...</div>
                ) : project ? (
                    <form className='AdminForm' onSubmit={handleSubmit}>
                        <ImageDropzone
                            label='Project image'
                            onUploaded={(url) => updateFormValue(setForm, 'img', url)}
                            value={form.img}
                        />
                        <label className='AdminField'>
                            <span>Link</span>
                            <input name='href' onChange={updateField('href')} required type='url' value={form.href} />
                        </label>
                        <label className='AdminField'>
                            <span>Title UA</span>
                            <input name='titleUa' onChange={updateField('titleUa')} required type='text' value={form.titleUa} />
                        </label>
                        <label className='AdminField'>
                            <span>Title EN</span>
                            <input name='titleEn' onChange={updateField('titleEn')} required type='text' value={form.titleEn} />
                        </label>
                        <label className='AdminField'>
                            <span>Text UA</span>
                            <textarea name='summaryUa' onChange={updateField('summaryUa')} rows='4' value={form.summaryUa} />
                        </label>
                        <label className='AdminField'>
                            <span>Text EN</span>
                            <textarea name='summaryEn' onChange={updateField('summaryEn')} rows='4' value={form.summaryEn} />
                        </label>
                        <div className='AdminActionsRow'>
                            <button className='AdminButton' disabled={adminStore.isSubmitting} type='submit'>
                                {adminStore.isSubmitting ? 'Saving...' : 'Update project'}
                            </button>
                            <Link className='AdminButton AdminButton__secondary' href='/admin/projects'>
                                Back
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className='AdminEmptyState'>
                        Project not found. <Link href='/admin/projects'>Back</Link>
                    </div>
                )}
            </section>
        </AdminPageShell>
    );
});

export default AdminProjectEditClient;
