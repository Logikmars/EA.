import '../../styles/CustomInput.scss';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

const CustomInput = ({
    type = 'text',
    placeholder = 'Default placeholder',
    value,
    onChange,
    error,
    className,
    options,
    w50,
    select,
    textarea,
    ...props
}) => {
    const inputId = props.id ?? props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const fieldRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const fieldClassName = clsx('CustomInputField', className, {
        CustomInputField_w50: w50,
        CustomInputField__open: select && isOpen,
    });
    const inputClassName = clsx('CustomInput', {
        CustomInput_textarea: textarea,
        CustomInput_error: Boolean(error),
        CustomInput_selectTrigger: select,
        CustomInput_selectTrigger__open: select && isOpen,
    });
    const selectedOption = options?.find((option) => option.value === value);
    const Tag = textarea ? 'textarea' : 'input';

    useEffect(() => {
        if (!select) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (!fieldRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('keydown', handleEscape);
        };
    }, [select]);

    if (select) {
        const handleOptionSelect = (nextValue) => {
            onChange?.({
                target: {
                    name: props.name,
                    value: nextValue,
                },
            });
            setIsOpen(false);
        };

        return (
            <div className={fieldClassName} ref={fieldRef}>
                <button
                    aria-controls={inputId ? `${inputId}-options` : undefined}
                    aria-describedby={errorId}
                    aria-expanded={isOpen}
                    aria-haspopup='listbox'
                    className={inputClassName}
                    id={inputId}
                    onClick={() => setIsOpen((currentValue) => !currentValue)}
                    type='button'
                >
                    <span className={`CustomInput_selectLabel${selectedOption ? ' CustomInput_selectLabel__selected' : ''}`}>
                        {selectedOption?.label || placeholder}
                    </span>
                    <span className='CustomInput_selectIcon' aria-hidden='true'>
                        <span />
                        <span />
                    </span>
                </button>
                <input name={props.name} type='hidden' value={value} />
                <div
                    className={`CustomInput_selectMenu${isOpen ? ' CustomInput_selectMenu__open' : ''}`}
                    id={inputId ? `${inputId}-options` : undefined}
                    role='listbox'
                >
                    {options?.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                aria-selected={isSelected}
                                className={`CustomInput_selectOption${isSelected ? ' CustomInput_selectOption__active' : ''}`}
                                key={option.value}
                                onClick={() => handleOptionSelect(option.value)}
                                role='option'
                                type='button'
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
                {error ? (
                    <p className='CustomInputField_message' id={errorId}>
                        {error}
                    </p>
                ) : null}
            </div>
        );
    }

    return (
        <div className={fieldClassName}>
            <Tag
                id={inputId}
                type={textarea ? undefined : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={inputClassName}
                aria-invalid={Boolean(error)}
                aria-describedby={errorId}
                {...props}
            />
            {error ? (
                <p className='CustomInputField_message' id={errorId}>
                    {error}
                </p>
            ) : null}
        </div>
    );
};

export default CustomInput;
