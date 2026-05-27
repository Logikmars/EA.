'use client';

import '../../styles/MainForm.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import CustomInput from '../ui/CustomInput';
import Text from '../ui/Text';
import Btn from '../ui/Btn';

const MainForm = () => {
    const rootRef = useRef(null);
    const t = useTranslations('MainForm');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        link: '',
        message: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(formData);
    };

    const inputs = [
        {
            w50: true,
            name: 'name',
            placeholder: t('fields.name'),
            value: formData.name,
            onChange: handleChange,
        },
        {
            w50: true,
            type: 'email',
            name: 'email',
            placeholder: t('fields.email'),
            value: formData.email,
            onChange: handleChange,
        },
        {
            w50: true,
            type: 'tel',
            name: 'phone',
            placeholder: t('fields.phone'),
            value: formData.phone,
            onChange: handleChange,
        },
        {
            w50: true,
            name: 'link',
            placeholder: t('fields.link'),
            value: formData.link,
            onChange: handleChange,
        },
        {
            w50: false,
            textarea: true,
            name: 'message',
            placeholder: t('fields.message'),
            value: formData.message,
            onChange: handleChange,
        },
    ];

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
                const fields = gsap.utils.toArray('.MainForm_form .CustomInput');
                const button = root.querySelector('.MainForm_form .Btn');

                fields.forEach((field, index) => {
                    const isLastField = index === fields.length - 1;
                    const fromState = {
                        opacity: 0,
                        x: isLastField ? 0 : index % 2 === 0 ? -56 : 56,
                        y: isLastField ? 56 : 0,
                    };

                    gsap.fromTo(field, fromState, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: root,
                            start: 'top 86%',
                            end: 'bottom 64%',
                            scrub: 1.8,
                        }
                    });
                });

                if (button) {
                    gsap.fromTo(button, {
                        opacity: 0,
                        y: 56,
                    }, {
                        opacity: 1,
                        y: 0,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: root,
                            start: 'top 86%',
                            end: 'bottom 64%',
                            scrub: 1.8,
                        }
                    });
                }
            }, root);

            cleanup = () => ctx.revert();
        };

        init();

        return () => cleanup();
    }, []);

    return (
        <section className='MainForm' id='contact' ref={rootRef}>
            <div className='MainForm_container container'>
                <div className='MainForm_text'>
                    <Text h2 white fw_semibold fs_3xl>
                        {t('title')}
                    </Text>
                    <Text white_60 fs_l>
                        {t('description')}
                    </Text>
                </div>
                <form className='MainForm_form' onSubmit={handleSubmit}>
                    {inputs.map((input) => (
                        <CustomInput key={input.name} {...input} />
                    ))}
                    <Btn color_white text_black>
                        {t('submit')}
                    </Btn>
                </form>
            </div>
        </section>
    );
};

export default MainForm;
