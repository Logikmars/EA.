'use client';

import '../../styles/Media.scss';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { observer } from 'mobx-react-lite';
import mediaStore from '@/stores/MediaStore';
import Btn from '../ui/Btn';
import MediaBlock from '../ui/MediaBlock';
import Text from '../ui/Text';

const Media = observer(({
    locale,
    mediaItems = [],
}) => {
    const rootRef = useRef(null);
    const t = useTranslations('Media');

    useEffect(() => {
        if (!locale) {
            return;
        }

        mediaStore.hydrate(locale, mediaItems);
        mediaStore.load(locale, mediaItems);
    }, [locale, mediaItems]);

    const displayMediaItems = locale ? mediaStore.getMedia(locale) : mediaItems;

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
                {displayMediaItems.slice(0, 4).map((media) => (
                    <MediaBlock
                        id={media.slug}
                        type={media.type}
                        img={media.img}
                        text={media.title}
                        description={media.summary}
                        href={media.sourceUrl || '#'}
                        alt={media.title}
                        key={media.slug}
                    />
                ))}
            </div>
        </section>
    );
});

export default Media;
