 'use client';

import '../../styles/Cooperation.scss';
import { useLayoutEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import CooperationBlock from '../ui/CooperationBlock';
import Text from '../ui/Text';

const Cooperation = () => {
    const rootRef = useRef(null);
    const t = useTranslations('Cooperation');

    const els = [
        {
            id: 'lecture',
            img: '/imgs/icons/mic.svg',
            alt: 'Lecture icon',
            href: '/invite',
        },
        {
            id: 'speech',
            img: '/imgs/icons/users.svg',
            alt: 'Public speaking icon',
            href: '/invite',
        },
        {
            id: 'consulting',
            img: '/imgs/icons/case.svg',
            alt: 'Consulting icon',
            href: '/invite',
        },
    ];

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
                const blocks = gsap.utils.toArray('.Cooperation_list .CooperationBlock');

                blocks.forEach((block, index) => {
                    const fromState = {
                        opacity: 0,
                        x: 0,
                        y: 0,
                    };

                    if (index === 0) fromState.x = -120;
                    if (index === 1) fromState.y = 120;
                    if (index === 2) fromState.x = 120;

                    gsap.fromTo(block, fromState, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: root,
                            start: 'top 78%',
                            end: 'bottom 70%',
                            scrub: 1,
                        }
                    });
                });
            }, root);

            cleanup = () => ctx.revert();
        };

        init();

        return () => cleanup();
    }, []);

    return (
        <section className='Cooperation' id='collaboration' ref={rootRef}>
            <div className='Cooperation_container container'>
                <Text h2 fw_semibold fs_2xl>
                    {t('title')}
                </Text>
                <div className='Cooperation_list'>
                    {els.map((el) => (
                        <CooperationBlock
                            img={el.img}
                            alt={el.alt}
                            title={t(`items.${el.id}.title`)}
                            description={t(`items.${el.id}.description`)}
                            btnText={t(`items.${el.id}.button`)}
                            href={el.href}
                            key={el.id}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Cooperation;
