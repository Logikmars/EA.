'use client';

import '../../styles/MainForm.scss';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import CustomInput from '../ui/CustomInput';
import Text from '../ui/Text';
import Btn from '../ui/Btn';

const MainForm = () => {
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

    return (
        <section className='MainForm'>
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
