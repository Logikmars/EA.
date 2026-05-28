'use client';

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import AdminPageShell from './AdminPageShell';
import ImageDropzone from './ImageDropzone';
import adminStore from '@/stores/AdminStore';
import { buildProjectPayload, emptyProjectForm, updateFormValue } from './adminFormUtils';

const AdminProjectCreateClient = observer(() => {
    const [form, setForm] = useState(emptyProjectForm);

    const updateField = (field) => (event) => {
        updateFormValue(setForm, field, event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await adminStore.createProject(buildProjectPayload(form));

        if (result.ok) {
            setForm(emptyProjectForm);
        }
    };

    return (
        <AdminPageShell description='Create a new project entry from a dedicated admin page.' title='Add project'>
            <section className='AdminCard'>
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
                            {adminStore.isSubmitting ? 'Saving...' : 'Add project'}
                        </button>
                    </div>
                </form>
            </section>
        </AdminPageShell>
    );
});

export default AdminProjectCreateClient;
