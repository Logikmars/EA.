import { localeToLanguageTag, metadataBase } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { inter } from '@/lib/fonts';
import { getLocale, getTranslations } from 'next-intl/server';
import '../styles/null.scss';

export async function generateMetadata() {
    const t = await getTranslations('SEO');

    return {
        metadataBase,
        title: t('siteTitle'),
        description: t('siteDescription'),
        icons: {
            icon: '/imgs/favicon.svg',
            shortcut: '/imgs/favicon.svg',
            apple: '/imgs/favicon.svg',
        },
        manifest: '/manifest.webmanifest',
        verification: {
            google: process.env.GOOGLE_SITE_VERIFICATION,
            other: {
                'msvalidate.01': process.env.BING_SITE_VERIFICATION,
            },
        },
        openGraph: {
            title: t('siteTitle'),
            description: t('siteDescription'),
            siteName: siteConfig.siteName,
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: siteConfig.siteName,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('siteTitle'),
            description: t('siteDescription'),
            images: [siteConfig.ogImage],
        },
    };
}

export default async function RootLayout({ children }) {
    const locale = await getLocale();
    const languageTag = localeToLanguageTag[locale] ?? locale;

    return (
        <html lang={languageTag}>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
