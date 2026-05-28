import NotFoundPage from '@/components/sections/NotFoundPage';
import { routing } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';

const copyByLocale = {
    en: {
        title: 'This page is missing, but the conversation can continue.',
        description: 'The link may be outdated, the page may have moved, or the URL may be incorrect. You can continue exploring Eduard Akhramovych as a business speaker, entrepreneur, consultant and founder of Art Nation from the main sections below.',
        primaryCta: 'Back to homepage',
        secondaryCta: 'Book a consultation',
        linksLabel: 'Popular pages:',
    },
    ua: {
        title: 'Цю сторінку не знайдено, але ми знаємо, куди вас спрямувати далі.',
        description: 'Посилання могло застаріти, сторінку могли перенести або адреса введена з помилкою. Продовжити знайомство з Едуардом Ахрамовичем, його проєктами, медіа та форматами співпраці можна з розділів нижче.',
        primaryCta: 'На головну',
        secondaryCta: 'Запросити Едуарда',
        linksLabel: 'Популярні сторінки:',
    },
};

export default async function LocaleNotFound() {
    const locale = await getLocale();
    const resolvedLocale = routing.locales.includes(locale) ? locale : routing.defaultLocale;
    const copy = copyByLocale[resolvedLocale] ?? copyByLocale.ua;

    return <NotFoundPage locale={resolvedLocale} {...copy} />;
}
