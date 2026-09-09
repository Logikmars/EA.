'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminPageShell from './AdminPageShell';
import ImageDropzone from './ImageDropzone';
import adminStore from '@/stores/AdminStore';
import {
    buildProjectPayload,
    emptyProjectForm,
    mapProjectToForm,
    updateFormValue,
} from './adminFormUtils';

const AdminProjectEditClient = observer(() => {
    const searchParams = useSearchParams();
    const projectId = searchParams.get('id') || '';
    const [form, setForm] = useState(emptyProjectForm);
    const [isLoaded, setIsLoaded] = useState(false);
    const project = adminStore.content.projects.find((item) => item.id === projectId);

    useEffect(() => {
        if (project) {
            setForm(mapProjectToForm(project));
        }

        setIsLoaded(true);
    }, [projectId, project]);

    const updateField = (field) => (event) => {
        updateFormValue(setForm, field, event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = buildProjectPayload(form);
        const result = await adminStore.updateProject(projectId, payload);

        if (result.ok) {
            const updatedProject = adminStore.content.projects.find((item) => item.id === projectId);

            if (updatedProject) {
                setForm(mapProjectToForm(updatedProject));
            }
        }
    };

    return (
        <AdminPageShell loadContent title='Edit project'>
            <section className='AdminCard'>
                {!isLoaded || adminStore.isLoadingContent ? (
                    <div className='AdminEmptyState'>Loading...</div>
                ) : projectId && project ? (
                    <form className='AdminForm' onSubmit={handleSubmit}>
                        <label className='AdminField'>
                            <span>Display order (1 = first)</span>
                            <input min='1' name='order' onChange={updateField('order')} required step='1' type='number' value={form.order} />
                        </label>
                        <ImageDropzone
                            label='Project image'
                            onUploaded={(url) => updateFormValue(setForm, 'img', url)}
                            value={form.img}
                        />
                        <label className='AdminField'>
                            <span>Link (optional)</span>
                            <input name='href' onChange={updateField('href')} type='url' value={form.href} />
                        </label>
                        <label className='AdminField'>
                            <span>Category UA</span>
                            <input name='categoryUa' onChange={updateField('categoryUa')} required type='text' value={form.categoryUa} />
                        </label>
                        <label className='AdminField'>
                            <span>Category EN</span>
                            <input name='categoryEn' onChange={updateField('categoryEn')} required type='text' value={form.categoryEn} />
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
