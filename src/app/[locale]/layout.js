import Header from '@/components/layout/Header';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

const LocaleLayout = async ({ children, params }) => {
    const { locale } = await params;

    if (!routing.locales.includes(locale)) {
        notFound();
    }

    setRequestLocale(locale);

    return (
        <NextIntlClientProvider>
            <Header />
            {children}
            <Footer />
        </NextIntlClientProvider>
    );
};

export default LocaleLayout;
