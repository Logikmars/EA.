'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import AdminPageShell from './AdminPageShell';
import adminStore from '@/stores/AdminStore';

const AdminMediaListClient = observer(() => {
    const handleDelete = async (slug) => {
        const isConfirmed = window.confirm('Delete this media item?');

        if (!isConfirmed) {
            return;
        }

        await adminStore.deleteMedia(slug);
    };

    return (
        <AdminPageShell description='Review and manage all stored media entries.' loadContent title='Media list'>
            <section className='AdminCard'>
                <div className='AdminCardHeader'>
                    <h2>Media</h2>
                    <span>{adminStore.content.media.length} custom items</span>
                </div>

                {adminStore.content.media.length ? (
                    <div className='AdminList'>
                        {adminStore.content.media.map((mediaItem) => (
                            <article className='AdminListItem' key={mediaItem.slug}>
                                <div className='AdminListItemMain'>
                                    <strong>{mediaItem.title?.en || mediaItem.title?.ua || 'Untitled media item'}</strong>
                                    <span>{mediaItem.sourceUrl}</span>
                                </div>
                                <div className='AdminListItemActions'>
                                    <Link className='AdminButton AdminButton__secondary AdminButton__small' href={`/admin/media/${mediaItem.slug}`}>
                                        Edit
                                    </Link>
                                    <button
                                        className='AdminButton AdminButton__danger AdminButton__small'
                                        onClick={() => handleDelete(mediaItem.slug)}
                                        type='button'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className='AdminEmptyState'>No media items yet.</div>
                )}
            </section>
        </AdminPageShell>
    );
});

export default AdminMediaListClient;
