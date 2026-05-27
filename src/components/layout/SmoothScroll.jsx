'use client';

import { useEffect } from 'react';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const isScrollableElement = (element) => {
    let current = element;

    while (current && current !== document.body) {
        const styles = window.getComputedStyle(current);
        const overflowY = styles.overflowY;
        const canScroll = (overflowY === 'auto' || overflowY === 'scroll') && current.scrollHeight > current.clientHeight;

        if (canScroll) {
            return true;
        }

        current = current.parentElement;
    }

    return false;
};

const SmoothScroll = () => {
    useEffect(() => {
        const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
        const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

        if (!desktopQuery.matches || reducedMotionQuery.matches) {
            return;
        }

        let rafId = 0;
        let currentY = window.scrollY;
        let targetY = window.scrollY;

        const maxScroll = () => (
            document.documentElement.scrollHeight - window.innerHeight
        );

        const clampTarget = (value) => Math.max(0, Math.min(value, maxScroll()));

        const updateScroll = () => {
            const delta = targetY - currentY;

            if (Math.abs(delta) < 0.5) {
                currentY = targetY;
                window.scrollTo(0, currentY);
                rafId = 0;
                return;
            }

            currentY += delta * 0.12;
            window.scrollTo(0, currentY);
            rafId = window.requestAnimationFrame(updateScroll);
        };

        const startAnimation = () => {
            if (!rafId) {
                rafId = window.requestAnimationFrame(updateScroll);
            }
        };

        const handleWheel = (event) => {
            if (event.ctrlKey || isScrollableElement(event.target)) {
                return;
            }

            event.preventDefault();
            targetY = clampTarget(targetY + event.deltaY * 0.9);
            startAnimation();
        };

        const handleScrollSync = () => {
            if (!rafId) {
                currentY = window.scrollY;
                targetY = window.scrollY;
            }
        };

        const handleResize = () => {
            targetY = clampTarget(targetY);
            currentY = clampTarget(currentY);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('scroll', handleScrollSync, { passive: true });
        window.addEventListener('resize', handleResize);

        return () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }

            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('scroll', handleScrollSync);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return null;
};

export default SmoothScroll;
