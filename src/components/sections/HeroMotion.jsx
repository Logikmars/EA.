'use client';

import { useEffect, useRef } from 'react';

const HeroMotion = () => {
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;

        const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;

        if (shouldReduceMotion || isMobileViewport) return;

        initializedRef.current = true;

        let cleanup = () => {};

        const init = async () => {
            const [{ default: gsap }] = await Promise.all([
                import('gsap'),
            ]);

            const textItems = gsap.utils.toArray('.Hero_animate_text');
            const buttons = gsap.utils.toArray('.Hero_animate_button');

            gsap.set(textItems, {
                y: 52,
                opacity: 0,
            });

            gsap.set(buttons, {
                y: 28,
                opacity: 0,
            });

            gsap.set('.Hero_animate_social', {
                y: 24,
                opacity: 0,
            });

            gsap.set('.Hero_animate_image', {
                x: 56,
                opacity: 0,
                scale: 0.94,
            });

            gsap.set('.Hero_animate_line', {
                y: 30,
                opacity: 0,
            });

            const timeline = gsap.timeline({
                defaults: {
                    ease: 'power3.out',
                },
            });

            timeline
                .to(textItems, {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.12,
                })
                .to('.Hero_animate_image', {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                }, 0)
                .to(buttons, {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.1,
                }, '-=0.45')
                .to('.Hero_animate_social', {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                }, '-=0.4')
                .to('.Hero_animate_line', {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                }, '-=0.45');

            cleanup = () => {
                timeline.kill();
            };
        };

        init();

        return () => cleanup();
    }, []);

    return null;
};

export default HeroMotion;
