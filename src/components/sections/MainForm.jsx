'use client';

import '../../styles/MainForm.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import CustomInput from '../ui/CustomInput';
import Text from '../ui/Text';
import Btn from '../ui/Btn';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s()\-]{7,}$/;
const initialFormData = {
    name: '',
    email: '',
    phone: '',
    link: '',
    message: '',
};

const validateForm = (formData, t) => {
    const errors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (name.length < 2) {
        errors.name = t('validation.name');
    }

    if (!emailPattern.test(email)) {
        errors.email = t('validation.email');
    }

    if (phone && !phonePattern.test(phone)) {
        errors.phone = t('validation.phone');
    }

    if (message.length < 10) {
        errors.message = t('validation.message');
    }

    return errors;
};

const MainForm = () => {
    const rootRef = useRef(null);
    const t = useTranslations('MainForm');

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [submitState, setSubmitState] = useState('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => {
            if (!prev[name]) return prev;

            const next = { ...prev };

            delete next[name];

            return next;
        });

        if (submitState !== 'idle') {
            setSubmitState('idle');
            setStatusMessage('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validateForm(formData, t);

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setSubmitState('error');
            setStatusMessage(t('status.validation'));

            return;
        }

        setErrors({});
        setSubmitState('loading');
        setStatusMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.fieldErrors) {
                    setErrors(data.fieldErrors);
                }

                setSubmitState('error');
                setStatusMessage(t('status.error'));

                return;
            }

            setFormData(initialFormData);
            setSubmitState('success');
            setStatusMessage('');
            toast.success(t('status.success'));
        } catch {
            setSubmitState('error');
            setStatusMessage(t('status.error'));
        }
    };

    const inputs = [
        {
            w50: true,
            name: 'name',
            placeholder: t('fields.name'),
            value: formData.name,
            onChange: handleChange,
            error: errors.name,
            autoComplete: 'name',
        },
        {
            w50: true,
            type: 'email',
            name: 'email',
            placeholder: t('fields.email'),
            value: formData.email,
            onChange: handleChange,
            error: errors.email,
            autoComplete: 'email',
        },
        {
            w50: true,
            type: 'tel',
            name: 'phone',
            placeholder: t('fields.phone'),
            value: formData.phone,
            onChange: handleChange,
            error: errors.phone,
            autoComplete: 'tel',
        },
        {
            w50: true,
            name: 'link',
            placeholder: t('fields.link'),
            value: formData.link,
            onChange: handleChange,
            error: errors.link,
            autoComplete: 'off',
        },
        {
            w50: false,
            textarea: true,
            name: 'message',
            placeholder: t('fields.message'),
            value: formData.message,
            onChange: handleChange,
            error: errors.message,
            rows: 6,
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
                    <Btn color_white text_black type='submit' disabled={submitState === 'loading'}>
                        {submitState === 'loading' ? t('submitting') : t('submit')}
                    </Btn>
                    {statusMessage ? (
                        <p className={`MainForm_status MainForm_status__${submitState}`}>
                            {statusMessage}
                        </p>
                    ) : null}
                </form>
            </div>
        </section>
    );
};

export default MainForm;
