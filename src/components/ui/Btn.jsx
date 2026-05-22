import Link from 'next/link';
import '../../styles/Btn.scss';
import clsx from 'clsx';

export default ({
    children,

    onClick,

    color_blue,
    color_white,
    color_gray,
    color_transparent,

    text_white,
    text_black,

    fs_xs,

    fw_medium,

    type = 'button',
    href,

}) => {

    const className = clsx('Btn', {
        'Btn_color_blue': color_blue,
        'Btn_color_white': color_white,
        'Btn_color_gray': color_gray,
        'Btn_color_transparent': color_transparent,
        'Btn_text_white': text_white,
        'Btn_text_black': text_black,
        'Btn_fs_xs': fs_xs,
        'Btn_fw_medium': fw_medium,
    });

    return (
        href ? <Link className={className} href={href}>
            {children}
        </Link>
        :
        <button className={className} onClick={onClick} type={type}>
            {children}
        </button>
    )
}