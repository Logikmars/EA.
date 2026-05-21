import '../../styles/Text.scss';
import clsx from 'clsx';

export default ({
    children,

    h1,
    h2,
    h3,
    a,

    light_gray,
    white,
    transparent_white,
    white_60,
    tac,

    fs_3xl,
    fs_2xl,
    fs_xl,
    fs_l,
    fs_m,
    fs_s,
    fs_xs,
    fs_2xs,

    fw_medium,
    fw_semibold,
    fw_bold,

    href = "#",

    styleClass = '',
}) => {

    const className = clsx('Text', styleClass, {
        'Text_color_lightGray': light_gray,
        'Text_color_white': white,
        'Text_color_transparentWhite': transparent_white,
        'Text_color_white60': white_60,
        'Text_tac': tac,
        'Text_fs_3xl': fs_3xl,
        'Text_fs_2xl': fs_2xl,
        'Text_fs_xl': fs_xl,
        'Text_fs_l': fs_l,
        'Text_fs_m': fs_m,
        'Text_fs_s': fs_s,
        'Text_fs_xs': fs_xs,
        'Text_fs_2xs': fs_2xs,
        'Text_fw_medium': fw_medium,
        'Text_fw_semibold': fw_semibold,
        'Text_fw_bold': fw_bold,
    });

    const Tag = h1 ? 'h1' : h2 ? 'h2' : h3 ? 'h3' : a ? 'a' : 'p';
    const shouldRotate = a && styleClass.split(' ').includes('rotate') && typeof children === 'string';

    const content = shouldRotate
        ? children.split('').map((letter, index) => (
            <span
                key={`${letter}-${index}`}
                className="rotate__letter"
                style={{ '--rotate-index': index }}
            >
                {letter === ' ' ? '\u00A0' : letter}
            </span>
        ))
        : (children ? children : 'Text not defined...');

    return (
        <Tag className={className} {...(a ? { href } : {})}>
            {content}
        </Tag>
    );
}
