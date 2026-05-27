import '../../styles/CustomInput.scss';
import clsx from 'clsx';

const CustomInput = ({
    type = 'text',
    placeholder = 'Default placeholder',
    value,
    onChange,
    error,
    className,

    w50,

    textarea,
    ...props
}) => {
    const inputId = props.id ?? props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const fieldClassName = clsx('CustomInputField', className, {
        CustomInputField_w50: w50,
    });
    const inputClassName = clsx('CustomInput', {
        CustomInput_textarea: textarea,
        CustomInput_error: Boolean(error),
    });
    const Tag = textarea ? 'textarea' : 'input';

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
