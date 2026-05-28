import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site';

export const metadataBase = new URL(siteConfig.siteUrl);
export const localeToLanguageTag = {
    en: 'en',
    ua: 'uk',
};

const baseKeywordsByLocale = {
    en: [
        'Eduard Akhramovych',
        'Art Nation',
        'entrepreneur',
        'keynote speaker',
        'business speaker',
        'marketing speaker',
        'business consultant',
        'brand licensing expert',
        'loyalty program consultant',
        'retail strategist',
        'consumer engagement expert',
        'marketing strategist',
        'brand licensing',
        'loyalty programs',
    ],
    ua: [
        'Едуард Ахрамович',
        'Eduard Akhramovych',
        'Art Nation',
        'підприємець',
        'бізнес спікер',
        'спікер з маркетингу',
        'бізнес консультант',
        'ліцензування брендів',
        'програми лояльності',
        'маркетингова стратегія',
        'ритейл',
        'споживча лояльність',
    ],
};

function buildKeywords(locale, keywords = []) {
    const baseKeywords = baseKeywordsByLocale[locale] ?? baseKeywordsByLocale.en;

    return [...new Set([...baseKeywords, ...keywords])];
}

export function getLocaleAlternates(locale, pathname = '') {
    const normalizedPath = pathname ? (pathname.startsWith('/') ? pathname : `/${pathname}`) : '';

    return {
        canonical: `/${locale}${normalizedPath}`,
        languages: {
            'x-default': `/ua${normalizedPath}`,
            ...Object.fromEntries(
                routing.locales.map((currentLocale) => [
                    localeToLanguageTag[currentLocale] ?? currentLocale,
                    `/${currentLocale}${normalizedPath}`
                ])
            ),
        },
    };
}

export function buildMetadata({
    locale,
    title,
    description,
    pathname = '',
    siteName = siteConfig.siteName,
    keywords = [],
    openGraphType = 'website',
}) {
    const normalizedPath = pathname ? (pathname.startsWith('/') ? pathname : `/${pathname}`) : '';
    const localizedPath = `/${locale}${normalizedPath}`;
    const resolvedTitle = normalizedPath ? `${title} | ${siteName}` : title;

    return {
        metadataBase,
        title: resolvedTitle,
        description,
        applicationName: siteConfig.siteName,
        appleWebApp: {
            capable: true,
            title: siteConfig.siteName,
            statusBarStyle: 'default',
        },
        authors: [{ name: siteConfig.legalName }],
        creator: siteConfig.legalName,
        publisher: siteConfig.organizationName,
        category: 'business',
        classification: 'Business, Consulting, Speaking',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        keywords: buildKeywords(locale, keywords),
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        },
        referrer: 'origin-when-cross-origin',
        alternates: getLocaleAlternates(locale, pathname),
        openGraph: {
            title: resolvedTitle,
            description,
            url: localizedPath,
            siteName,
            locale: locale === 'ua' ? 'uk_UA' : 'en_US',
            alternateLocale: locale === 'ua' ? ['en_US'] : ['uk_UA'],
            type: openGraphType,
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: siteName,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: resolvedTitle,
            description,
            images: [siteConfig.ogImage],
        },
        other: {
            'theme-color': '#1c5cff',
        },
    };
}
