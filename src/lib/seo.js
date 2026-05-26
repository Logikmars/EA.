import { routing } from '@/i18n/routing';

export const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com');

export function getLocaleAlternates(locale, pathname = '') {
    const normalizedPath = pathname ? (pathname.startsWith('/') ? pathname : `/${pathname}`) : '';

    return {
        canonical: `/${locale}${normalizedPath}`,
        languages: {
            'x-default': `/ua${normalizedPath}`,
            ...Object.fromEntries(
                routing.locales.map((locale) => [locale, `/${locale}${normalizedPath}`])
            ),
        },
    };
}

export function buildMetadata({ locale, title, description, pathname = '' }) {
    return {
        metadataBase,
        title,
        description,
        alternates: getLocaleAlternates(locale, pathname),
        openGraph: {
            title,
            description,
            url: `/${locale}${pathname}`,
            siteName: 'Eduard Akhramovych',
            locale: locale === 'ua' ? 'uk_UA' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}
