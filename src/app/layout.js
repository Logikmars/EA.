import { metadataBase } from '@/lib/seo';
import { getLocale, getTranslations } from 'next-intl/server';
import '../styles/fonts.scss';
import '../styles/null.scss';

export async function generateMetadata() {
    const t = await getTranslations('SEO');

    return {
        metadataBase,
        title: t('siteTitle'),
        description: t('siteDescription'),
    };
}

export default async function RootLayout({ children }) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <body>
                {children}
            </body>
        </html>
    );
}
