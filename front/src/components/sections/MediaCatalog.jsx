'use client';

import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import MediaBlock from '../ui/MediaBlock';
import AnimatedRevealList from '../ui/AnimatedRevealList';
import mediaStore from '@/stores/MediaStore';

const MediaCatalog = observer(({
    locale,
    initialItems = [],
    clearLabel = 'Clear',
    emptyLabel = 'No media items match the selected tags.',
}) => {
    const [selectedTypes, setSelectedTypes] = useState([]);

    useEffect(() => {
        mediaStore.hydrate(locale, initialItems);
        mediaStore.load(locale, initialItems);
    }, [initialItems, locale]);

    const items = mediaStore.getMedia(locale);
    const availableTypes = Array.from(new Set(
        items
            .map((item) => (typeof item?.type === 'string' ? item.type.trim() : ''))
            .filter(Boolean)
    ));
    const visibleItems = selectedTypes.length
        ? items.filter((item) => selectedTypes.includes(item?.type))
        : items;

    const toggleType = (type) => {
        setSelectedTypes((currentTypes) => (
            currentTypes.includes(type)
                ? currentTypes.filter((currentType) => currentType !== type)
                : [...currentTypes, type]
        ));
    };

    const clearFilters = () => {
        setSelectedTypes([]);
    };

    return (
        <>
            {availableTypes.length ? (
                <div className='MediaPage_filters'>
                    {availableTypes.map((type) => {
                        const isSelected = selectedTypes.includes(type);

                        return (
                            <button
                                key={type}
                                className={`MediaPage_filter ${isSelected ? 'MediaPage_filter__active' : ''}`}
                                onClick={() => toggleType(type)}
                                type='button'
                            >
                                {type}
                            </button>
                        );
                    })}
                    {selectedTypes.length ? (
                        <button
                            className='MediaPage_filter MediaPage_filter__clear'
                            onClick={clearFilters}
                            type='button'
                        >
                            {clearLabel}
                        </button>
                    ) : null}
                </div>
            ) : null}

            {visibleItems.length ? (
                <AnimatedRevealList className='MediaPage_list' itemSelector='.MediaBlock'>
                    {visibleItems.map((mediaItem) => (
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
            ) : (
                <div className='MediaPage_empty'>
                    {emptyLabel}
                </div>
            )}
        </>
    );
});

export default MediaCatalog;
