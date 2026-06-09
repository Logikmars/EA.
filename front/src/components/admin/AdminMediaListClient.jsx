'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import AdminPageShell from './AdminPageShell';
import adminStore from '@/stores/AdminStore';

const AdminMediaListClient = observer(() => {
    const handleDelete = async (sourceUrl) => {
        const isConfirmed = window.confirm('Delete this media item?');

        if (!isConfirmed) {
            return;
        }

        await adminStore.deleteMedia(sourceUrl);
    };

    return (
        <AdminPageShell loadContent title='Media'>
            <section className='AdminCard'>
                <div className='AdminCardHeader'>
                    <h2>Media</h2>
                    <span>{adminStore.content.media.length} items</span>
                </div>

                {adminStore.content.media.length ? (
                    <div className='AdminList'>
                        {adminStore.content.media.map((mediaItem) => (
                            <article className='AdminListItem' key={mediaItem.sourceUrl}>
                                <div className='AdminListItemMain'>
                                    <strong>{mediaItem.title?.en || mediaItem.title?.ua || 'Untitled media item'}</strong>
                                    <span>{mediaItem.sourceUrl}</span>
                                </div>
                                <div className='AdminListItemActions'>
                                    <Link className='AdminButton AdminButton__secondary AdminButton__small' href={`/admin/media/edit?sourceUrl=${encodeURIComponent(mediaItem.sourceUrl)}`}>
                                        Edit
                                    </Link>
                                    <button
                                        className='AdminButton AdminButton__danger AdminButton__small'
                                        onClick={() => handleDelete(mediaItem.sourceUrl)}
                                        type='button'
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className='AdminEmptyState'>No media</div>
                )}
            </section>
        </AdminPageShell>
    );
});

export default AdminMediaListClient;
