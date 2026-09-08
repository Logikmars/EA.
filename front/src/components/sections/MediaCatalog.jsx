'use client';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import MediaBlock from '../ui/MediaBlock';
import AnimatedRevealList from '../ui/AnimatedRevealList';
import mediaStore from '@/stores/MediaStore';

const MediaCatalog = observer(({
    locale,
    initialItems = [],
    clearLabel = 'Clear',
    emptyLabel = 'No media items match the selected tags.',
    sortLabel = 'Sort by date',
    newestLabel = 'Newest first',
    oldestLabel = 'Oldest first',
}) => {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortOrder, setSortOrder] = useState('newest');

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
    const visibleItems = useMemo(() => {
        const getTimestamp = (item) => {
            const timestamp = Date.parse(item?.publishedAt || item?.createdAt || '');

            return Number.isNaN(timestamp) ? 0 : timestamp;
        };
        const filteredItems = selectedTypes.length
            ? items.filter((item) => selectedTypes.includes(item?.type))
            : items;

        return [...filteredItems].sort((firstItem, secondItem) => (
            sortOrder === 'oldest'
                ? getTimestamp(firstItem) - getTimestamp(secondItem)
                : getTimestamp(secondItem) - getTimestamp(firstItem)
        ));
    }, [items, selectedTypes, sortOrder]);

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
            <div className='MediaPage_controls'>
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
                <label className='MediaPage_sort'>
                    <span>{sortLabel}</span>
                    <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                        <option value='newest'>{newestLabel}</option>
                        <option value='oldest'>{oldestLabel}</option>
                    </select>
                </label>
            </div>

            {visibleItems.length ? (
                <AnimatedRevealList className='MediaPage_list' itemSelector='.MediaBlock'>
                    {visibleItems.map((mediaItem) => (
                        <MediaBlock
                            key={mediaItem.id || mediaItem.sourceUrl || mediaItem.title}
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
