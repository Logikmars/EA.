'use client';

import '../../styles/Faq.scss';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Text from '../ui/Text';

const Faq = () => {
    const rootRef = useRef(null);
    const contentRefs = useRef([]);
    const t = useTranslations('Faq');
    const [openItems, setOpenItems] = useState(() => Array(6).fill(false));
    const items = Array.from({ length: 6 }, (_, index) => ({
        question: t(`items.${index}.question`),
        answer: t(`items.${index}.answer`),
    }));

    useEffect(() => {
        const updateHeights = () => {
            contentRefs.current.forEach((element, index) => {
                if (!element) {
                    return;
                }

                element.style.setProperty(
                    '--faq-answer-height',
                    openItems[index] ? `${element.scrollHeight}px` : '0px',
                );
            });
        };

        updateHeights();

        window.addEventListener('resize', updateHeights);

        return () => {
            window.removeEventListener('resize', updateHeights);
        };
    }, [openItems, items.length]);

    const toggleItem = (index) => {
        setOpenItems((current) => current.map((isOpen, itemIndex) => (
            itemIndex === index ? !isOpen : isOpen
        )));
    };

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
                const heading = gsap.utils.toArray('.Faq_heading > *');
                const itemsList = gsap.utils.toArray('.Faq_list .Faq_item');

                gsap.fromTo(heading, {
                    opacity: 0,
                    y: 28,
                }, {
                    opacity: 1,
                    y: 0,
                    ease: 'power2.out',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 84%',
                        once: true,
                    }
                });

                itemsList.forEach((item, index) => {
                    const fromState = {
                        opacity: 0,
                        x: 0,
                        y: 0,
                    };

                    if (index % 3 === 0) fromState.x = -72;
                    if (index % 3 === 1) fromState.y = 72;
                    if (index % 3 === 2) fromState.x = 72;

                    gsap.fromTo(item, fromState, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 88%',
                            end: 'top 56%',
                            scrub: 1.2,
                        }
                    });
                });
            }, root);

            cleanup = () => ctx.revert();
        };

        init();

        return () => cleanup();
    }, []);

    return (
        <section className='Faq' id='faq' ref={rootRef}>
            <div className='Faq_container container'>
                <div className='Faq_heading'>
                    <Text h2 fw_semibold fs_2xl>
                        {t('title')}
                    </Text>
                    <Text fs_l className='Faq_description'>
                        {t('description')}
                    </Text>
                </div>
                <div className='Faq_list'>
                    {items.map((item, index) => (
                        <article
                            className={`Faq_item${openItems[index] ? ' Faq_item__open' : ''}`}
                            key={`faq_item_${index}`}
                        >
                            <button
                                className='Faq_question'
                                type='button'
                                aria-expanded={openItems[index]}
                                aria-controls={`faq-answer-${index}`}
                                onClick={() => toggleItem(index)}
                            >
                                <Text h3 fw_semibold fs_l className='Faq_questionText'>
                                    {item.question}
                                </Text>
                                <span className='Faq_icon' aria-hidden='true' />
                            </button>
                            <div
                                className={`Faq_answerWrap${openItems[index] ? ' Faq_answerWrap__open' : ''}`}
                                id={`faq-answer-${index}`}
                                ref={(element) => {
                                    contentRefs.current[index] = element;
                                }}
                            >
                                <div className='Faq_answer'>
                                <Text fs_m>{item.answer}</Text>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;
