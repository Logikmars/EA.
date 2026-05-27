 'use client';

import '../../styles/Info.scss';
import { useLayoutEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import InfoBlock from '../ui/InfoBlock';
import Text from '../ui/Text';

const Info = () => {
    const rootRef = useRef(null);
    const t = useTranslations('Info');

    const els = [
        {
            amount: t('stats.years.amount'),
            description: t('stats.years.description'),
        },
        {
            amount: t('stats.ventures.amount'),
            description: t('stats.ventures.description'),
        },
        {
            amount: t('stats.campaigns.amount'),
            description: t('stats.campaigns.description'),
        },
    ];

    const texts = [
        t('paragraphs.first'),
        t('paragraphs.second'),
        t('paragraphs.third'),
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
                const blocks = gsap.utils.toArray('.Info_list .InfoBlock');
                const chars = gsap.utils.toArray('.Info_text_char');

                gsap.set(blocks, {
                    opacity: 0.2,
                    y: 72
                });

                gsap.set(chars, {
                    opacity: 0.16
                });

                const blocksTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 82%',
                        end: 'top 34%',
                        scrub: 1
                    }
                });

                blocksTimeline.to(blocks, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'none',
                    stagger: 0.14
                });

                const textTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 82%',
                        end: 'bottom bottom',
                        scrub: 1
                    }
                });

                textTimeline.to(chars, {
                    opacity: 1,
                    duration: 1,
                    ease: 'none',
                    stagger: {
                        each: 0.018,
                        from: 'start',
                    }
                });
            }, root);

            cleanup = () => ctx.revert();
        };

        init();

        return () => cleanup();
    }, []);

    const renderAnimatedText = (value) => (
        value.split('').map((char, index) => (
            <span
                className='Info_text_char'
                key={`Info_text_char_${index}_${char}`}
            >
                {char === ' ' ? '\u00A0' : char}
            </span>
        ))
    );

    return (
        <section className='Info' id='about' ref={rootRef}>
            <div className='Info_container container'>
                <div className='Info_list'>
                    {els.map((el) => (
                        <InfoBlock amount={el.amount} description={el.description} key={`InfoBlock_ley_${el.amount}_${el.description}`} />
                    ))}
                </div>
                <div className='Info_text'>
                    {texts.map((el) => (
                        <Text fw_medium fs_xl className='Info_text_line' key={`Info_text_key_${el}`}>
                            {renderAnimatedText(el)}
                        </Text>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Info;
