'use client';

import '../../styles/Projects.scss';
import { getProjects } from '@/lib/content';
import { useLayoutEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Btn from '../ui/Btn';
import ProjectBlock from '../ui/ProjectBlock';
import Text from '../ui/Text';

const Projects = () => {
    const rootRef = useRef(null);
    const t = useTranslations('Projects');
    const locale = useLocale();
    const projects = getProjects(locale);

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
                    y: 96,
                });

                gsap.to(blocks, {
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    stagger: 0.18,
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 78%',
                        end: 'bottom 100%',
                        scrub: 1,
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
                {projects.slice(0, 3).map((project) => (
                    <ProjectBlock
                        href={`/projects/${project.slug}`}
                        img={project.img}
                        title={project.title}
                        description={project.summary}
                        alt={project.title}
                        id={project.slug}
                        key={project.slug}
                    />
                ))}
            </div>
        </section>
    );
};

export default Projects;
