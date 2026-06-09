'use client';

import '../../styles/MainForm.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { validateContactField } from '@/lib/contactFormSchema';
import CustomInput from '../ui/CustomInput';
import Text from '../ui/Text';
import Btn from '../ui/Btn';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialFormData = {
    name: '',
    email: '',
    phone: '',
    link: '',
    company: '',
    inquiryType: 'speaking',
    budget: 'undisclosed',
    message: '',
    website: '',
};

const formContentByLocale = {
    en: {
        company: 'Company / brand',
        inquiryType: 'What do you need?',
        budget: 'Budget range',
        message: 'Tell me about your goal, audience or business task...',
        note: 'Share a bit of context and I can reply with a more relevant format and next step.',
        inquiryOptions: [
            { value: 'speaking', label: 'Speaking' },
            { value: 'consulting', label: 'Consulting' },
            { value: 'partnership', label: 'Partnership' },
            { value: 'other', label: 'Other' },
        ],
        budgetOptions: [
            { value: 'undisclosed', label: 'Budget not set yet' },
            { value: 'under-5k', label: 'Under 5k USD' },
            { value: '5k-15k', label: '5k - 15k USD' },
            { value: '15k-plus', label: '15k+ USD' },
        ],
        validation: {
            company: 'Company name is too long',
            inquiryType: 'Choose the request type',
            budget: 'Choose a budget range',
            website: 'Spam detected',
        },
    },
    ua: {
        company: 'Компанія / бренд',
        inquiryType: 'Що вам потрібно?',
        budget: 'Діапазон бюджету',
        message: 'Опишіть вашу ціль, аудиторію або бізнес-запит...',
        note: 'Що більше контексту ви дасте, то точніше я зможу запропонувати формат співпраці та наступний крок.',
        inquiryOptions: [
            { value: 'speaking', label: 'Виступ' },
            { value: 'consulting', label: 'Консультація' },
            { value: 'partnership', label: 'Партнерство' },
            { value: 'other', label: 'Інше' },
        ],
        budgetOptions: [
            { value: 'undisclosed', label: 'Бюджет ще не визначено' },
            { value: 'under-5k', label: 'До 5k USD' },
            { value: '5k-15k', label: '5k - 15k USD' },
            { value: '15k-plus', label: '15k+ USD' },
        ],
        validation: {
            company: 'Назва компанії занадто довга',
            inquiryType: 'Оберіть тип запиту',
            budget: 'Оберіть діапазон бюджету',
            website: 'Виявлено спам',
        },
    },
};

const validateForm = (formData, t, content) => {
    const errors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const company = formData.company.trim();
    const message = formData.message.trim();
    const linkErrorMessage = typeof t.has === 'function' && t.has('validation.link')
        ? t('validation.link')
        : 'Enter a valid http or https link';

    if (name.length < 2) {
        errors.name = t('validation.name');
    }

    if (!emailPattern.test(email)) {
        errors.email = t('validation.email');
    }

    if (phone && !validateContactField('phone', phone)) {
        errors.phone = t('validation.phone');
    }

    if (formData.link.trim() && !validateContactField('link', formData.link)) {
        errors.link = linkErrorMessage;
    }

    if (company && !validateContactField('company', company)) {
        errors.company = content.validation.company;
    }

    if (!validateContactField('inquiryType', formData.inquiryType)) {
        errors.inquiryType = content.validation.inquiryType;
    }

    if (!validateContactField('budget', formData.budget)) {
        errors.budget = content.validation.budget;
    }

    if (message.length < 10) {
        errors.message = t('validation.message');
    }

    if (formData.website) {
        errors.website = content.validation.website;
    }

    return errors;
};

const MainForm = () => {
    const rootRef = useRef(null);
    const locale = useLocale();
    const t = useTranslations('MainForm');
    const content = formContentByLocale[locale] ?? formContentByLocale.en;

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
        const nextErrors = validateForm(formData, t, content);

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
                setStatusMessage(data?.message || t('status.error'));

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
            name: 'company',
            placeholder: content.company,
            value: formData.company,
            onChange: handleChange,
            error: errors.company,
            autoComplete: 'organization',
        },
        {
            w50: true,
            select: true,
            name: 'inquiryType',
            value: formData.inquiryType,
            onChange: handleChange,
            error: errors.inquiryType,
            options: content.inquiryOptions,
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
            select: true,
            name: 'budget',
            value: formData.budget,
            onChange: handleChange,
            error: errors.budget,
            options: content.budgetOptions,
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
            placeholder: content.message,
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
                const fields = gsap.utils.toArray('.MainForm_form .CustomInputField');
                const note = root.querySelector('.MainForm_note');
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

                if (note) {
                    gsap.fromTo(note, {
                        opacity: 0,
                        y: 32,
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
                    <input
                        className='MainForm_honeypot'
                        name='website'
                        onChange={handleChange}
                        tabIndex={-1}
                        type='text'
                        value={formData.website}
                    />
                    <p className='MainForm_note'>
                        {content.note}
                    </p>
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
