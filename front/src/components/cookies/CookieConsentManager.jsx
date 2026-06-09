'use client';

import '../../styles/CookieConsent.scss';
import Script from 'next/script';
import { useLocale } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    defaultCookieConsent,
    readStoredCookieConsent,
    storeCookieConsent,
} from '@/lib/cookieConsent';

const contentByLocale = {
    en: {
        badge: 'Privacy settings',
        title: 'We use cookies to run the site and understand what is useful.',
        description: 'Necessary cookies keep the admin area and contact form secure. Optional analytics cookies help us measure traffic with Google Analytics 4.',
        necessary: 'Necessary',
        analytics: 'Analytics',
        marketing: 'Marketing',
        alwaysOn: 'Always on',
        necessaryDescription: 'Required for sign-in, security, and form protection.',
        analyticsDescription: 'Lets us measure visits and page usage with GA4.',
        marketingDescription: 'Reserved for future advertising tools. Disabled unless you allow it.',
        acceptAll: 'Accept all',
        rejectOptional: 'Reject optional',
        save: 'Save settings',
    },
    ua: {
        badge: 'Налаштування cookies',
        title: 'Ми використовуємо cookies для роботи сайту та розуміння, що корисно відвідувачам.',
        description: 'Необхідні cookies підтримують безпечну роботу адмінки та форми. Додаткові аналітичні cookies допомагають вимірювати трафік через Google Analytics 4.',
        necessary: 'Необхідні',
        analytics: 'Аналітичні',
        marketing: 'Маркетингові',
        alwaysOn: 'Завжди активні',
        necessaryDescription: 'Потрібні для входу, безпеки та захисту форми.',
        analyticsDescription: 'Дозволяють вимірювати відвідування та перегляди сторінок через GA4.',
        marketingDescription: 'Резерв для майбутніх рекламних інструментів. Вимкнені, доки ви не дасте згоду.',
        acceptAll: 'Прийняти всі',
        rejectOptional: 'Лише необхідні',
        save: 'Зберегти',
    },
};

function getContent(locale) {
    return contentByLocale[locale] ?? contentByLocale.en;
}

function buildPagePath(pathname, searchParams) {
    const queryString = searchParams?.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
}

export default function CookieConsentManager() {
    const locale = useLocale();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || '';
    const content = getContent(locale);
    const [storedConsent, setStoredConsent] = useState(null);
    const [draftConsent, setDraftConsent] = useState(defaultCookieConsent);
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isAnalyticsReady, setIsAnalyticsReady] = useState(false);

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            const savedConsent = readStoredCookieConsent();

            if (savedConsent) {
                setStoredConsent(savedConsent);
                setDraftConsent(savedConsent);
            }

            setIsReady(true);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, []);

    useEffect(() => {
        const handleOpenPreferences = () => {
            setIsManageOpen(true);
        };
        const handleAnalyticsReady = () => {
            setIsAnalyticsReady(true);
        };

        window.addEventListener('cookie-consent:open', handleOpenPreferences);
        window.addEventListener('ga4-ready', handleAnalyticsReady);

        return () => {
            window.removeEventListener('cookie-consent:open', handleOpenPreferences);
            window.removeEventListener('ga4-ready', handleAnalyticsReady);
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !storedConsent) {
            return;
        }

        window.gtag('consent', 'update', {
            analytics_storage: storedConsent.analytics ? 'granted' : 'denied',
            ad_storage: storedConsent.marketing ? 'granted' : 'denied',
            ad_user_data: storedConsent.marketing ? 'granted' : 'denied',
            ad_personalization: storedConsent.marketing ? 'granted' : 'denied',
        });
    }, [storedConsent]);

    useEffect(() => {
        if (!measurementId || !storedConsent?.analytics || !isAnalyticsReady || typeof window === 'undefined' || typeof window.gtag !== 'function') {
            return;
        }

        window.gtag('config', measurementId, {
            page_path: buildPagePath(pathname, searchParams),
        });
    }, [isAnalyticsReady, measurementId, pathname, searchParams, storedConsent]);

    const saveConsent = (nextConsent) => {
        storeCookieConsent(nextConsent);
        setStoredConsent(nextConsent);
        setDraftConsent(nextConsent);
        setIsManageOpen(false);

        if (!nextConsent.analytics) {
            setIsAnalyticsReady(false);
        }

        window.dispatchEvent(new CustomEvent('cookie-consent:updated', {
            detail: nextConsent,
        }));
    };

    const handleAcceptAll = () => {
        saveConsent({
            necessary: true,
            analytics: true,
            marketing: true,
        });
    };

    const handleRejectOptional = () => {
        saveConsent({
            necessary: true,
            analytics: false,
            marketing: false,
        });
    };

    const handleSaveSettings = () => {
        saveConsent({
            necessary: true,
            analytics: draftConsent.analytics,
            marketing: draftConsent.marketing,
        });
    };

    const shouldShowBanner = isReady && !storedConsent;
    const shouldShowPanel = shouldShowBanner || isManageOpen;
    const shouldLoadAnalytics = Boolean(measurementId) && Boolean(storedConsent?.analytics);

    return (
        <>
            {shouldLoadAnalytics ? (
                <>
                    <Script
                        id='ga4-loader'
                        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                        strategy='afterInteractive'
                    />
                    <Script id='ga4-config' strategy='afterInteractive'>
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            window.gtag = gtag;
                            gtag('js', new Date());
                            gtag('consent', 'default', {
                                analytics_storage: '${storedConsent.analytics ? 'granted' : 'denied'}',
                                ad_storage: '${storedConsent.marketing ? 'granted' : 'denied'}',
                                ad_user_data: '${storedConsent.marketing ? 'granted' : 'denied'}',
                                ad_personalization: '${storedConsent.marketing ? 'granted' : 'denied'}'
                            });
                            gtag('config', '${measurementId}', {
                                anonymize_ip: true,
                                send_page_view: false
                            });
                            window.dispatchEvent(new Event('ga4-ready'));
                        `}
                    </Script>
                </>
            ) : null}
            {shouldShowPanel ? (
                <div className='CookieConsent' role='dialog' aria-live='polite' aria-label={content.badge}>
                    <div className='CookieConsent_panel'>
                        <div className='CookieConsent_scroll'>
                            <span className='CookieConsent_badge'>
                                {content.badge}
                            </span>
                            <h2 className='CookieConsent_title'>
                                {content.title}
                            </h2>
                            <p className='CookieConsent_description'>
                                {content.description}
                            </p>
                            <div className='CookieConsent_categories'>
                                <div className='CookieConsent_category'>
                                    <div>
                                        <div className='CookieConsent_categoryTitle'>{content.necessary}</div>
                                        <div className='CookieConsent_categoryDescription'>{content.necessaryDescription}</div>
                                    </div>
                                    <span className='CookieConsent_status CookieConsent_status__locked'>{content.alwaysOn}</span>
                                </div>
                                <label className='CookieConsent_category'>
                                    <div>
                                        <div className='CookieConsent_categoryTitle'>{content.analytics}</div>
                                        <div className='CookieConsent_categoryDescription'>{content.analyticsDescription}</div>
                                    </div>
                                    <input
                                        type='checkbox'
                                        checked={draftConsent.analytics}
                                        onChange={(event) => {
                                            setDraftConsent((currentValue) => ({
                                                ...currentValue,
                                                analytics: event.target.checked,
                                            }));
                                        }}
                                    />
                                </label>
                                <label className='CookieConsent_category'>
                                    <div>
                                        <div className='CookieConsent_categoryTitle'>{content.marketing}</div>
                                        <div className='CookieConsent_categoryDescription'>{content.marketingDescription}</div>
                                    </div>
                                    <input
                                        type='checkbox'
                                        checked={draftConsent.marketing}
                                        onChange={(event) => {
                                            setDraftConsent((currentValue) => ({
                                                ...currentValue,
                                                marketing: event.target.checked,
                                            }));
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className='CookieConsent_footer'>
                            <div className='CookieConsent_actions'>
                                <button className='CookieConsent_btn CookieConsent_btn__ghost' type='button' onClick={handleRejectOptional}>
                                    {content.rejectOptional}
                                </button>
                                <button className='CookieConsent_btn CookieConsent_btn__ghost' type='button' onClick={handleSaveSettings}>
                                    {content.save}
                                </button>
                                <button className='CookieConsent_btn CookieConsent_btn__primary' type='button' onClick={handleAcceptAll}>
                                    {content.acceptAll}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
