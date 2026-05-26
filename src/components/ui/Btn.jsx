import Link from 'next/link';
import { Link as IntlLink } from '@/i18n/navigation';
import '../../styles/Btn.scss';
import clsx from 'clsx';

const Btn = ({
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

    w100,

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
        'Btn_w100': w100
    });

    const isPlainLink = href && (
        href.startsWith('#')
        || href.startsWith('http')
        || href.startsWith('mailto:')
        || href.startsWith('tel:')
    );

    return (
        href ? (
            isPlainLink ? (
                <Link className={className} href={href} onClick={onClick}>
                    {children}
                </Link>
            ) : (
                <IntlLink className={className} href={href} onClick={onClick}>
                    {children}
                </IntlLink>
            )
        ) : (
            <button className={className} onClick={onClick} type={type}>
                {children}
            </button>
        )
    );
};

export default Btn;
