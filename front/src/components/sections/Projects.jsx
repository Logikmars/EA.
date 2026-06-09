'use client';

import '../../styles/Projects.scss';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { observer } from 'mobx-react-lite';
import projectsStore from '@/stores/ProjectsStore';
import Btn from '../ui/Btn';
import ProjectBlock from '../ui/ProjectBlock';
import Text from '../ui/Text';

const Projects = observer(({
    locale,
    projects = [],
}) => {
    const rootRef = useRef(null);
    const t = useTranslations('Projects');

    useEffect(() => {
        if (!locale) {
            return;
        }

        projectsStore.hydrate(locale, projects);
        projectsStore.load(locale, projects);
    }, [locale, projects]);

    const displayProjects = locale ? projectsStore.getProjects(locale) : projects;

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;

        if (shouldReduceMotion || isMobileViewport) return;

        let cleanup = () => {};

        const init = async () => {
            const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger'),
            ]);

            gsap.registerPlugin(ScrollTrigger);

            const ctx = gsap.context(() => {
                const blocks = gsap.utils.toArray('.Projects_list .ProjectBlock');

                gsap.set(blocks, {
                    opacity: 0,
                    y: 52,
                });

                gsap.to(blocks, {
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 86%',
                        end: 'bottom 68%',
                        scrub: 1.6,
                    }
                });
            }, root);

            cleanup = () => ctx.revert();
        };

        init();

        return () => cleanup();
    }, []);

    return (
        <section className='Projects container' id='projects' ref={rootRef}>
            <div className='Projects_top'>
                <Text h2 fw_semibold fs_2xl>
                    {t('title')}
                </Text>
                <Btn color_transparent text_black fw_medium href='/projects'>
                    {t('all')}
                </Btn>
            </div>
            <div className='Projects_list'>
                {displayProjects.slice(0, 3).map((project) => (
                    <ProjectBlock
                        href={project.href || '#'}
                        img={project.img}
                        title={project.title}
                        description={project.summary}
                        alt={project.title}
                        key={project.href || project.title}
                    />
                ))}
            </div>
        </section>
    );
});

export default Projects;
