'use client';

import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import ProjectBlock from '../ui/ProjectBlock';
import AnimatedRevealList from '../ui/AnimatedRevealList';
import projectsStore from '@/stores/ProjectsStore';

const ProjectsCatalog = observer(({
    locale,
    initialItems = [],
    filtersLabel = 'Filters',
    searchPlaceholder = 'Search projects',
    clearLabel = 'Clear',
    emptyLabel = 'No projects match the selected filters.',
}) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        projectsStore.hydrate(locale, initialItems);
        projectsStore.load(locale, initialItems);
    }, [initialItems, locale]);

    const items = projectsStore.getProjects(locale);
    const availableCategories = useMemo(() => (
        Array.from(new Set(
            items
                .map((item) => (typeof item?.category === 'string' ? item.category.trim() : ''))
                .filter(Boolean)
        ))
    ), [items]);
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const visibleItems = items.filter((project) => {
        const matchesCategory = selectedCategories.length
            ? selectedCategories.includes(project?.category)
            : true;
        const projectTitle = String(project?.title ?? '').toLowerCase();
        const projectSummary = String(project?.summary ?? '').toLowerCase();
        const matchesSearch = normalizedSearchQuery
            ? projectTitle.includes(normalizedSearchQuery) || projectSummary.includes(normalizedSearchQuery)
            : true;

        return matchesCategory && matchesSearch;
    });

    const toggleCategory = (category) => {
        setSelectedCategories((currentCategories) => (
            currentCategories.includes(category)
                ? currentCategories.filter((currentCategory) => currentCategory !== category)
                : [...currentCategories, category]
        ));
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSearchQuery('');
    };

    return (
        <>
            <div className='ProjectsPage_controls'>
                <div className='ProjectsPage_search'>
                    <input
                        className='ProjectsPage_searchInput'
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={searchPlaceholder}
                        type='search'
                        value={searchQuery}
                    />
                </div>

                {availableCategories.length ? (
                    <div className='ProjectsPage_filters'>
                        <span className='ProjectsPage_filtersLabel'>{filtersLabel}</span>
                        {availableCategories.map((category) => {
                            const isSelected = selectedCategories.includes(category);

                            return (
                                <button
                                    key={category}
                                    className={`ProjectsPage_filter ${isSelected ? 'ProjectsPage_filter__active' : ''}`}
                                    onClick={() => toggleCategory(category)}
                                    type='button'
                                >
                                    {category}
                                </button>
                            );
                        })}
                        {(selectedCategories.length || searchQuery) ? (
                            <button
                                className='ProjectsPage_filter ProjectsPage_filter__clear'
                                onClick={clearFilters}
                                type='button'
                            >
                                {clearLabel}
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>

            {visibleItems.length ? (
                <AnimatedRevealList className='ProjectsPage_list' itemSelector='.ProjectBlock'>
                    {visibleItems.map((project) => (
                        <ProjectBlock
                            key={project.href || project.title}
                            img={project.img}
                            title={project.title}
                            description={project.summary}
                            alt={project.title}
                            href={project.href || '#'}
                        />
                    ))}
                </AnimatedRevealList>
            ) : (
                <div className='ProjectsPage_empty'>
                    {emptyLabel}
                </div>
            )}
        </>
    );
});

export default ProjectsCatalog;
