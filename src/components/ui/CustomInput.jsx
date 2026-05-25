import '../../styles/CustomInput.scss';
const CustomInput = ({
    type = 'text',
    placeholder = 'Default placeholder',
    value,
    onChange,

    w50,

    textarea,
    ...props
}) => {

    const className = `CustomInput
    ${w50 ? 'CustomInput_w50' : ''}
    ${textarea ? 'CustomInput_textarea' : ''}
    `

    const Tag = textarea ? 'textarea' : 'input'

    return (
        <Tag
            type={textarea ? undefined : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
            {...props}
        />
    )
}

export default CustomInput
