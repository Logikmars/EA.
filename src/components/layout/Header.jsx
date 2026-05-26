'use client';

import '../../styles/Header.scss';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Fragment, useEffect, useState } from 'react';
import Btn from '../ui/Btn';
import Text from '../ui/Text';

const Header = () => {
    const t = useTranslations('Header');
    const locale = useLocale();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        {
            key: 'about',
            href: '/#about',
        },
        {
            key: 'projects',
            href: '/#projects',
        },
        {
            key: 'collaboration',
            href: '/#collaboration',
        },
        {
            key: 'media',
            href: '/#media',
        },
    ];

    const languages = [
        {
            locale: 'ua',
            label: t('languages.ua'),
        },
        {
            locale: 'en',
            label: t('languages.en'),
        },
    ];

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isMenuOpen]);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className='Header'>
            <div className='Header_container container'>
                <Link className='Header_logo' href='/#top' aria-label={t('homeAriaLabel')}>
                    <Text h1 fs_l fw_bold>
                        EA.
                    </Text>
                </Link>
                <nav className='Header_nav'>
                    {links.map((el) => (
                        <Link className='Text Text_fs_xs Text_fw_medium rotate' href={el.href} key={el.key}>
                            {t(`links.${el.key}`)}
                        </Link>
                    ))}
                </nav>
                <div className='Header_actions'>
                    <div className='Header_langs' aria-label={t('languageSwitcher')}>
                        {languages.map((language, index) => (
                            <Fragment key={language.locale}>
                                <Link
                                    className={`Header_lang${language.locale === locale ? ' Header_lang__active' : ''}`}
                                    href={pathname}
                                    locale={language.locale}
                                    aria-current={language.locale === locale ? 'page' : undefined}
                                >
                                    <span className='Header_langLabel'>
                                        {language.label}
                                    </span>
                                </Link>
                                {index < languages.length - 1 && <span className='Header_langDivider'>/</span>}
                            </Fragment>
                        ))}
                    </div>
                    <Btn color_blue fs_xs fw_medium href='/invite'>
                        {t('contact')}
                    </Btn>
                </div>
                <button
                    className={`Header_actionsMob${isMenuOpen ? ' Header_actionsMob__active' : ''}`}
                    type='button'
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls='mobile-menu'
                    onClick={() => setIsMenuOpen((prevState) => !prevState)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <div
                className={`Header_overlay${isMenuOpen ? ' Header_overlay__active' : ''}`}
                onClick={closeMenu}
                aria-hidden={!isMenuOpen}
            />
            <div
                className={`Header_drawer${isMenuOpen ? ' Header_drawer__active' : ''}`}
                id='mobile-menu'
                aria-hidden={!isMenuOpen}
            >
                <Link className='Header_drawerLogo' href='/#top' aria-label={t('homeAriaLabel')} onClick={closeMenu}>
                    <Text h1 fs_l fw_bold>
                        EA.
                    </Text>
                </Link>
                <nav className='Header_drawerNav'>
                    {links.map((el) => (
                        <Link
                            className='Text Text_fs_s Text_fw_medium Header_drawerLink'
                            href={el.href}
                            key={el.key}
                            onClick={closeMenu}
                        >
                            {t(`links.${el.key}`)}
                        </Link>
                    ))}
                </nav>
                <div className='Header_drawerFooter'>
                    <div className='Header_langs' aria-label={t('languageSwitcher')}>
                        {languages.map((language, index) => (
                            <Fragment key={language.locale}>
                                <Link
                                    className={`Header_lang${language.locale === locale ? ' Header_lang__active' : ''}`}
                                    href={pathname}
                                    locale={language.locale}
                                    aria-current={language.locale === locale ? 'page' : undefined}
                                    onClick={closeMenu}
                                >
                                    <span className='Header_langLabel'>
                                        {language.label}
                                    </span>
                                </Link>
                                {index < languages.length - 1 && <span className='Header_langDivider'>/</span>}
                            </Fragment>
                        ))}
                    </div>
                    <Btn color_blue fs_xs fw_medium href='/invite' onClick={closeMenu}>
                        {t('contact')}
                    </Btn>
                </div>
            </div>
        </header>
    );
};

export default Header;
