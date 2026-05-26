'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const AnimatedRevealList = ({
    className,
    itemSelector,
    children,
}) => {
    const rootRef = useRef(null);

    gsap.registerPlugin(ScrollTrigger);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root) return;

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

        return () => ctx.revert();
    }, [itemSelector]);

    return (
        <div className={className} ref={rootRef}>
            {children}
        </div>
    );
};

export default AnimatedRevealList;
