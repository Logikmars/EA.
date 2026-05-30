'use client';

import { useEffect } from 'react';

const SCROLL_TOGGLE_EVENT = 'smooth-scroll:toggle';

const SmoothScroll = () => {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        let lenis;
        let gsap;
        let destroyTicker = () => {};
        let removeToggleListener = () => {};

        const init = async () => {
            const [{ default: Lenis }, { default: gsapModule }, { ScrollTrigger }] = await Promise.all([
                import('lenis'),
                import('gsap'),
                import('gsap/ScrollTrigger'),
            ]);

            gsap = gsapModule;
            gsap.registerPlugin(ScrollTrigger);

            lenis = new Lenis({
                duration: 1.2,
                smoothWheel: true,
                smoothTouch: false,
                wheelMultiplier: 0.9,
                touchMultiplier: 1.1,
                easing: (t) => 1 - Math.pow(1 - t, 4),
                anchors: true,
            });

            lenis.on('scroll', ScrollTrigger.update);

            const update = (time) => {
                lenis.raf(time * 1000);
            };

            gsap.ticker.add(update);
            gsap.ticker.lagSmoothing(0);

            destroyTicker = () => {
                gsap.ticker.remove(update);
            };

            const handleToggle = (event) => {
                if (!lenis) {
                    return;
                }

                if (event.detail?.locked) {
                    lenis.stop();
                    return;
                }

                lenis.start();
            };

            window.addEventListener(SCROLL_TOGGLE_EVENT, handleToggle);
            removeToggleListener = () => {
                window.removeEventListener(SCROLL_TOGGLE_EVENT, handleToggle);
            };
        };

        init();

        return () => {
            removeToggleListener();
            destroyTicker();
            lenis?.destroy();
        };
    }, []);

    return null;
};

export default SmoothScroll;
