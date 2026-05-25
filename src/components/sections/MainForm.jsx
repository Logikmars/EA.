'use client';

import '../../styles/MainForm.scss';
import { useState } from 'react';
import CustomInput from '../ui/CustomInput';
import Text from '../ui/Text';
import Btn from '../ui/Btn';

const MainForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
    })

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        console.log(formData)
    }

    const inputs = [
        {
            w50: true,
            name: 'name',
            placeholder: 'Full name',
            value: formData.name,
            onChange: handleChange,
        },
        {
            w50: true,
            type: 'email',
            name: 'email',
            placeholder: 'Email address',
            value: formData.email,
            onChange: handleChange,
        },
        {
            w50: true,
            type: 'tel',
            name: 'phone',
            placeholder: 'Phone number',
            value: formData.company,
            onChange: handleChange,
        },
        {
            w50: true,
            name: 'link',
            placeholder: 'Telegram / LinkedIn',
            value: formData.phone,
            onChange: handleChange,
        },
        {
            w50: false,
            textarea: true,
            name: 'message',
            placeholder: 'Tell me something...',
            value: formData.message,
            onChange: handleChange,
        },
    ]

    return (
        <section className='MainForm'>
            <div className='MainForm_container container'>
                <div className='MainForm_text'>
                    <Text h2 white fw_semibold fs_3xl>
                        Let&apos;s build something big.
                    </Text>
                    <Text white_60 fs_l>
                        Whether you need a keynote speaker for your next major event, or a strategic consultation to break through your company&apos;s growth ceiling, let&apos;s connect.
                    </Text>
                </div>
                <form className='MainForm_form' onSubmit={handleSubmit}>
                    {inputs.map((input) => (
                        <CustomInput key={input.name} {...input} />
                    ))}
                    <Btn color_white text_black>
                        Send request
                    </Btn>
                </form>
            </div>
        </section>
    )
}

export default MainForm
