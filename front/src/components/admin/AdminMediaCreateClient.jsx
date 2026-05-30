'use client';

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import AdminPageShell from './AdminPageShell';
import ImageDropzone from './ImageDropzone';
import adminStore from '@/stores/AdminStore';
import { buildMediaPayload, emptyMediaForm, updateFormValue } from './adminFormUtils';

const AdminMediaCreateClient = observer(() => {
    const [form, setForm] = useState(emptyMediaForm);

    const updateField = (field) => (event) => {
        updateFormValue(setForm, field, event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await adminStore.createMedia(buildMediaPayload(form));

        if (result.ok) {
            setForm(emptyMediaForm);
        }
    };

    return (
        <AdminPageShell title='Add media'>
            <section className='AdminCard'>
                <form className='AdminForm' onSubmit={handleSubmit}>
                    <ImageDropzone
                        label='Media image'
                        onUploaded={(url) => updateFormValue(setForm, 'img', url)}
                        value={form.img}
                    />
                    <label className='AdminField'>
                        <span>Type UA</span>
                        <input name='typeUa' onChange={updateField('typeUa')} required type='text' value={form.typeUa} />
                    </label>
                    <label className='AdminField'>
                        <span>Type EN</span>
                        <input name='typeEn' onChange={updateField('typeEn')} required type='text' value={form.typeEn} />
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
                    <label className='AdminField'>
                        <span>Source URL</span>
                        <input name='sourceUrl' onChange={updateField('sourceUrl')} required type='url' value={form.sourceUrl} />
                    </label>
                    <div className='AdminActionsRow'>
                        <button className='AdminButton' disabled={adminStore.isSubmitting} type='submit'>
                            {adminStore.isSubmitting ? 'Saving...' : 'Add media'}
                        </button>
                    </div>
                </form>
            </section>
        </AdminPageShell>
    );
});

export default AdminMediaCreateClient;
