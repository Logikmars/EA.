"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import "../../styles/RunningLine.scss";

export default function RunningLine() {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    const els = [
        {
            img: "/imgs/parnters/atb.svg",
            alt: "ATB logo"
        },
        {
            img: "/imgs/parnters/watsons.svg",
            alt: "Watsons logo"
        },
        {
            img: "/imgs/parnters/carrefour.svg",
            alt: "Carrefour logo"
        },
        {
            img: "/imgs/parnters/silpo.svg",
            alt: "Silpo logo"
        },
        {
            img: "/imgs/parnters/novus.svg",
            alt: "Novus logo"
        }
    ];

    const animatedEls = [...els, ...els, ...els];

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const ctx = gsap.context(() => {
            const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
            let tween = null;
            let resizeTimeout = null;
            let observer = null;
            let cancelled = false;

            if (shouldReduceMotion || isMobileViewport) {
                gsap.set(track, { clearProps: "all", opacity: 1, x: 0 });
                return;
            }

            gsap.set(track, {
                x: 0,
                opacity: 0
            });

            const createTween = () => {
                if (cancelled) return;

                if (tween) {
                    tween.kill();
                }

                gsap.set(track, { x: 0 });

                const maxOffset = Math.max(track.scrollWidth - container.offsetWidth, 0);
                gsap.set(track, { opacity: 1 });

                if (!maxOffset) return;

                tween = gsap.to(track, {
                    x: -maxOffset,
                    duration: 30,
                    ease: "none",
                    repeat: -1,
                    yoyo: true
                });
            };

            const scheduleInit = () => {
                if (resizeTimeout) {
                    window.clearTimeout(resizeTimeout);
                }

                resizeTimeout = window.setTimeout(() => {
                    createTween();
                }, 120);
            };

            const waitForTrackAssets = async () => {
                const images = Array.from(track.querySelectorAll("img"));

                await Promise.all(images.map((img) => {
                    if (img.complete) {
                        return Promise.resolve();
                    }

                    return new Promise((resolve) => {
                        const handleDone = () => {
                            img.removeEventListener("load", handleDone);
                            img.removeEventListener("error", handleDone);
                            resolve();
                        };

                        img.addEventListener("load", handleDone, { once: true });
                        img.addEventListener("error", handleDone, { once: true });
                    });
                }));

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        createTween();
                    });
                });
            };

            waitForTrackAssets();

            window.addEventListener("resize", scheduleInit);
            observer = new ResizeObserver(scheduleInit);
            observer.observe(container);
            observer.observe(track);

            return () => {
                cancelled = true;
                if (resizeTimeout) {
                    window.clearTimeout(resizeTimeout);
                }
                if (observer) {
                    observer.disconnect();
                }
                window.removeEventListener("resize", scheduleInit);
                if (tween) {
                    tween.kill();
                }
            };
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            className="RunningLine"
            ref={containerRef}
        >
            <div
                className="RunningLine_track"
                ref={trackRef}
            >
                {animatedEls.map((el, index) => (
                    <Image
                        key={`RunningLine_el_img_${index}_${el.img}`}
                        src={el.img}
                        alt={el.alt}
                        width={150}
                        height={20}
                        className="RunningLine_img"
                    />
                ))}
            </div>
        </div>
    );
}
