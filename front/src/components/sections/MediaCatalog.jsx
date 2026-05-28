'use client';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import MediaBlock from '../ui/MediaBlock';
import AnimatedRevealList from '../ui/AnimatedRevealList';
import mediaStore from '@/stores/MediaStore';

const MediaCatalog = observer(({
    locale,
    initialItems = [],
}) => {
    useEffect(() => {
        mediaStore.hydrate(locale, initialItems);
        mediaStore.load(locale, initialItems);
    }, [initialItems, locale]);

    const items = mediaStore.getMedia(locale);

    return (
        <AnimatedRevealList className='MediaPage_list' itemSelector='.MediaBlock'>
            {items.map((mediaItem) => (
                <MediaBlock
                    id={mediaItem.slug}
                    key={mediaItem.slug}
                    type={mediaItem.type}
                    img={mediaItem.img}
                    text={mediaItem.title}
                    description={mediaItem.summary}
                    href={mediaItem.sourceUrl || '#'}
                    alt={mediaItem.title}
                />
            ))}
        </AnimatedRevealList>
    );
});

export default MediaCatalog;
