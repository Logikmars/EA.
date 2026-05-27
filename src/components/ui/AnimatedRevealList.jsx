'use client';

import { useLayoutEffect, useRef } from 'react';

const AnimatedRevealList = ({
    className,
    itemSelector,
    children,
}) => {
    const rootRef = useRef(null);

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
                const blocks = gsap.utils.toArray(itemSelector);

                gsap.set(blocks, {
                    opacity: 0,
                    y: 96,
                });

                gsap.to(blocks, {
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    stagger: 0.14,
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 82%',
                        end: 'bottom 70%',
                        scrub: 1,
                    }
                });
            }, root);

            cleanup = () => ctx.revert();
        };

        init();

        return () => cleanup();
    }, [itemSelector]);

    return (
        <div className={className} ref={rootRef}>
            {children}
        </div>
    );
};

export default AnimatedRevealList;
