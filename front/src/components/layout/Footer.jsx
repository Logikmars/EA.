'use client';

import '../../styles/Footer.scss';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import SocialBar from '../ui/SocialBar';

const Footer = () => {
    const t = useTranslations('Footer');

    return (
        <footer className='Footer'>
            <div className='Footer_container container'>
                <SocialBar />
                <div className='Footer_meta'>
                    <Link className='Footer_link' href='/privacy-policy'>
                        {t('privacyPolicy')}
                    </Link>
                    <Link className='Footer_link' href='/terms-of-use'>
                        {t('termsOfUse')}
                    </Link>
                    <Link className='Footer_link' href='/cookie-policy'>
                        {t('cookiePolicy')}
                    </Link>
                    <button
                        className='Footer_link Footer_button'
                        type='button'
                        onClick={() => window.dispatchEvent(new Event('cookie-consent:open'))}
                    >
                        {t('cookieSettings')}
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
