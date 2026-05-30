'use client';

import '../../styles/Achivment.scss';
import { useLayoutEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Text from '../ui/Text';

const Achivment = () => {
    const rootRef = useRef(null);
    const t = useTranslations('Achivment');
    const items = Array.from({ length: 2 }, (_, index) => ({
        source: t(`items.${index}.source`),
        title: t(`items.${index}.title`),
        description: t(`items.${index}.description`),
        imageLabel: t(`items.${index}.imageLabel`),
    }));

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
                const heading = gsap.utils.toArray('.Achivment_heading > *');
                const cards = gsap.utils.toArray('.Achivment_list .Achivment_card');

                gsap.fromTo(heading, {
                    opacity: 0,
                    y: 28,
                }, {
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 84%',
                        once: true,
                    }
                });

                cards.forEach((card, index) => {
                    gsap.fromTo(card, {
                        opacity: 0,
                        x: index === 0 ? -72 : 72,
                        y: 18,
                    }, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 88%',
                            end: 'top 56%',
                            scrub: 1.2,
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
        <section className='Achivment' id='achievements' ref={rootRef}>
            <div className='Achivment_container container'>
                <div className='Achivment_heading'>
                    <Text h2 fw_semibold fs_2xl>
                        {t('title')}
                    </Text>
                    <Text fs_l className='Achivment_description'>
                        {t('description')}
                    </Text>
                </div>
                <div className='Achivment_list'>
                    {items.map((item, index) => (
                        <article className='Achivment_card' key={`achivment_card_${index}`}>
                            <div className='Achivment_cardContent'>
                                <div className='Achivment_badge'>
                                    <Text fs_2xs fw_semibold>
                                        {item.source}
                                    </Text>
                                </div>
                                <Text h3 fw_semibold fs_xl className='Achivment_cardTitle'>
                                    {item.title}
                                </Text>
                                <Text fs_m className='Achivment_cardDescription'>
                                    {item.description}
                                </Text>
                            </div>
                            <div className='Achivment_media' aria-label={item.imageLabel} role='img'>
                                <span className='Achivment_mediaGlow' aria-hidden='true' />
                                <Text fs_xs fw_medium className='Achivment_mediaText'>
                                    {item.imageLabel}
                                </Text>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achivment;
