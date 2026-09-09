'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import AdminPageShell from './AdminPageShell';
import adminStore from '@/stores/AdminStore';

const AdminMediaListClient = observer(() => {
    const [sortOrder, setSortOrder] = useState('displayOrder');
    const getTimestamp = (mediaItem) => {
        const timestamp = Date.parse(mediaItem?.publishedAt || mediaItem?.createdAt || '');

        return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const sortedMedia = sortOrder === 'displayOrder'
        ? adminStore.content.media
        : [...adminStore.content.media].sort((firstItem, secondItem) => (
            sortOrder === 'oldest'
                ? getTimestamp(firstItem) - getTimestamp(secondItem)
                : getTimestamp(secondItem) - getTimestamp(firstItem)
        ));

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('Delete this media item?');

        if (!isConfirmed) {
            return;
        }

        await adminStore.deleteMedia(id);
    };

    return (
        <AdminPageShell loadContent title='Media'>
            <section className='AdminCard'>
                <div className='AdminCardHeader'>
                    <h2>Media</h2>
                    <div className='AdminCardHeaderControls'>
                        <span>{adminStore.content.media.length} items</span>
                        <label className='AdminSort'>
                            <span>Sort</span>
                            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                                <option value='displayOrder'>Display order</option>
                                <option value='newest'>Newest first</option>
                                <option value='oldest'>Oldest first</option>
                            </select>
                        </label>
                    </div>
                </div>

                {adminStore.content.media.length ? (
                    <div className='AdminList'>
                        {sortedMedia.map((mediaItem) => (
                            <article className='AdminListItem' key={mediaItem.id}>
                                <div className='AdminListItemMain'>
                                    <strong>{mediaItem.title?.en || mediaItem.title?.ua || 'Untitled media item'}</strong>
                                    <span>Display order: {mediaItem.order || 'Not set'}</span>
                                    <span>{mediaItem.sourceUrl || 'No source URL'}</span>
                                    <span>
                                        Date: {String(mediaItem.publishedAt || mediaItem.createdAt || 'Not specified').slice(0, 10)}
                                    </span>
                                </div>
                                <div className='AdminListItemActions'>
                                    <Link className='AdminButton AdminButton__secondary AdminButton__small' href={`/admin/media/edit?id=${encodeURIComponent(mediaItem.id)}`}>
                                        Edit
                                    </Link>
                                    <button
                                        className='AdminButton AdminButton__danger AdminButton__small'
                                        onClick={() => handleDelete(mediaItem.id)}
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
