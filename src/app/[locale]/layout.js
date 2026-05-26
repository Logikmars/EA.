import Header from '@/components/layout/Header';
import StructuredData from '@/components/seo/StructuredData';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import { buildPersonSchema, buildWebsiteSchema } from '@/lib/schema';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

const LocaleLayout = async ({ children, params }) => {
    const { locale } = await params;

    if (!routing.locales.includes(locale)) {
        notFound();
    }

    setRequestLocale(locale);
    const seoT = await getTranslations('SEO');
    const structuredData = [
        buildPersonSchema({
            locale,
            description: seoT('siteDescription'),
        }),
        buildWebsiteSchema({
            locale,
            description: seoT('siteDescription'),
        }),
    ];

    return (
        <NextIntlClientProvider>
            <StructuredData data={structuredData} />
            <Header />
            <main id='main-content'>
                {children}
            </main>
            <Footer />
        </NextIntlClientProvider>
    );
};

export default LocaleLayout;
