'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminPageShell from './AdminPageShell';
import ImageDropzone from './ImageDropzone';
import adminStore from '@/stores/AdminStore';
import {
    buildMediaPayload,
    emptyMediaForm,
    mapMediaToForm,
    updateFormValue,
} from './adminFormUtils';

const AdminMediaEditClient = observer(() => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSourceUrl = searchParams.get('sourceUrl') || '';
    const [form, setForm] = useState(emptyMediaForm);
    const [isLoaded, setIsLoaded] = useState(false);
    const mediaItem = adminStore.content.media.find((item) => item.sourceUrl === currentSourceUrl);

    useEffect(() => {
        if (mediaItem) {
            setForm(mapMediaToForm(mediaItem));
        }

        setIsLoaded(true);
    }, [currentSourceUrl, mediaItem]);

    const updateField = (field) => (event) => {
        updateFormValue(setForm, field, event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = buildMediaPayload(form);
        const result = await adminStore.updateMedia(currentSourceUrl, payload);

        if (result.ok) {
            const updatedMedia = adminStore.content.media.find((item) => item.sourceUrl === payload.sourceUrl);

            if (updatedMedia) {
                setForm(mapMediaToForm(updatedMedia));
            }

            if (payload.sourceUrl !== currentSourceUrl) {
                router.replace(`/admin/media/edit?sourceUrl=${encodeURIComponent(payload.sourceUrl)}`);
            }
        }
    };

    return (
        <AdminPageShell loadContent title='Edit media'>
            <section className='AdminCard'>
                {!isLoaded || adminStore.isLoadingContent ? (
                    <div className='AdminEmptyState'>Loading...</div>
                ) : currentSourceUrl && mediaItem ? (
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
                                {adminStore.isSubmitting ? 'Saving...' : 'Update media'}
                            </button>
                            <Link className='AdminButton AdminButton__secondary' href='/admin/media'>
                                Back
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className='AdminEmptyState'>
                        Media item not found. <Link href='/admin/media'>Back</Link>
                    </div>
                )}
            </section>
        </AdminPageShell>
    );
});

export default AdminMediaEditClient;
