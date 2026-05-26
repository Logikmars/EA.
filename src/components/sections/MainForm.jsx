'use client';

import '../../styles/MainForm.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import CustomInput from '../ui/CustomInput';
import Text from '../ui/Text';
import Btn from '../ui/Btn';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    gsap.registerPlugin(ScrollTrigger);

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

        const ctx = gsap.context(() => {
            const fields = gsap.utils.toArray('.MainForm_form .CustomInput');
            const button = root.querySelector('.MainForm_form .Btn');

            fields.forEach((field, index) => {
                const isLastField = index === fields.length - 1;
                const fromState = {
                    opacity: 0,
                    x: isLastField ? 0 : index % 2 === 0 ? -120 : 120,
                    y: isLastField ? 120 : 0,
                };

                gsap.fromTo(field, fromState, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 80%',
                        end: 'bottom 70%',
                        scrub: 1,
                    }
                });
            });

            if (button) {
                gsap.fromTo(button, {
                    opacity: 0,
                    y: 120,
                }, {
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 80%',
                        end: 'bottom 70%',
                        scrub: 1,
                    }
                });
            }
        }, root);

        return () => ctx.revert();
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
