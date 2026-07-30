'use client';

import '../../styles/Info.scss';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import InfoBlock from '../ui/InfoBlock';

const Info = () => {
    const rootRef = useRef(null);
    const t = useTranslations('Info');
    const [isDesktopAnimated, setIsDesktopAnimated] = useState(false);

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

    useEffect(() => {
        const mobileQuery = window.matchMedia('(max-width: 767px)');
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updateAnimationState = () => {
            setIsDesktopAnimated(!mobileQuery.matches && !reducedMotionQuery.matches);
        };

        updateAnimationState();
        mobileQuery.addEventListener('change', updateAnimationState);
        reducedMotionQuery.addEventListener('change', updateAnimationState);

        return () => {
            mobileQuery.removeEventListener('change', updateAnimationState);
            reducedMotionQuery.removeEventListener('change', updateAnimationState);
        };
    }, []);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root || !isDesktopAnimated) return;

        let cleanup = () => {};

        const init = async () => {
            const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger'),
            ]);

            gsap.registerPlugin(ScrollTrigger);

            const ctx = gsap.context(() => {
                const blocks = gsap.utils.toArray('.Info_list .InfoBlock');
                gsap.set(blocks, {
                    opacity: 0.2,
                    y: 40
                });

                const blocksTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 86%',
                        end: 'top 42%',
                        scrub: 1.8
                    }
                });

                blocksTimeline.to(blocks, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power1.out',
                    stagger: 0.08
                });

            }, root);

            cleanup = () => ctx.revert();
        };

        init();

        return () => cleanup();
    }, [isDesktopAnimated]);

    return (
        <section className='Info' id='about' ref={rootRef}>
            <div className='Info_container container'>
                <div className='Info_list'>
                    {els.map((el) => (
                        <InfoBlock amount={el.amount} description={el.description} key={`InfoBlock_ley_${el.amount}_${el.description}`} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Info;
