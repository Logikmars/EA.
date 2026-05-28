'use client';

import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import ProjectBlock from '../ui/ProjectBlock';
import AnimatedRevealList from '../ui/AnimatedRevealList';
import projectsStore from '@/stores/ProjectsStore';

const ProjectsCatalog = observer(({
    locale,
    initialItems = [],
}) => {
    useEffect(() => {
        projectsStore.hydrate(locale, initialItems);
        projectsStore.load(locale, initialItems);
    }, [initialItems, locale]);

    const items = projectsStore.getProjects(locale);

    return (
        <AnimatedRevealList className='ProjectsPage_list' itemSelector='.ProjectBlock'>
            {items.map((project) => (
                <ProjectBlock
                    id={project.slug}
                    key={project.slug}
                    img={project.img}
                    title={project.title}
                    description={project.summary}
                    alt={project.title}
                    href={project.href || '#'}
                />
            ))}
        </AnimatedRevealList>
    );
});

export default ProjectsCatalog;
