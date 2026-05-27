'use client';

import '../../styles/Media.scss';
import { getMediaItems } from '@/lib/content';
import { useLayoutEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Btn from '../ui/Btn';
import MediaBlock from '../ui/MediaBlock';
import Text from '../ui/Text';

const Media = () => {
    const rootRef = useRef(null);
    const t = useTranslations('Media');
    const locale = useLocale();
    const mediaItems = getMediaItems(locale);

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
                const blocks = gsap.utils.toArray('.Media_list .MediaBlock');

                gsap.set(blocks, {
                    opacity: 0,
                    y: 96,
                });

                gsap.to(blocks, {
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    stagger: 0.16,
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
        <section className='Media container' id='media' ref={rootRef}>
            <div className='Media_top'>
                <Text h2 fw_semibold fs_2xl>
                    {t('title')}
                </Text>
                <Btn color_transparent text_black fw_medium href='/media'>
                    {t('all')}
                </Btn>
            </div>
            <div className='Media_list'>
                {mediaItems.slice(0, 4).map((media) => (
                    <MediaBlock
                        id={media.slug}
                        type={media.type}
                        img={media.img}
                        text={media.title}
                        href={`/media/${media.slug}`}
                        alt={media.title}
                        key={media.slug}
                    />
                ))}
            </div>
        </section>
    );
};

export default Media;
