'use client';

import '../../styles/Projects.scss';
import { getProjects } from '@/lib/content';
import { useLayoutEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Btn from '../ui/Btn';
import ProjectBlock from '../ui/ProjectBlock';
import Text from '../ui/Text';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Projects = () => {
    const rootRef = useRef(null);
    const t = useTranslations('Projects');
    const locale = useLocale();
    const projects = getProjects(locale);

    gsap.registerPlugin(ScrollTrigger);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root) return;

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

        return () => ctx.revert();
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
