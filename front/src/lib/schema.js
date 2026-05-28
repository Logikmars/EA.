import { localeToLanguageTag } from '@/lib/seo';
import { siteConfig, toAbsoluteUrl } from '@/lib/site';

export function buildPersonSchema({ locale, description }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': toAbsoluteUrl(`/${locale}#person`),
        name: siteConfig.legalName,
        url: toAbsoluteUrl(`/${locale}`),
        image: toAbsoluteUrl(siteConfig.ogImage),
        jobTitle: 'Entrepreneur, speaker, founder of Art Nation',
        description,
        worksFor: {
            '@type': 'Organization',
            name: siteConfig.organizationName,
        },
        sameAs: siteConfig.sameAs,
    };
}

export function buildWebsiteSchema({ locale, description }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': toAbsoluteUrl(`/${locale}#website`),
        url: toAbsoluteUrl(`/${locale}`),
        name: siteConfig.siteName,
        description,
        inLanguage: localeToLanguageTag[locale] ?? locale,
        publisher: {
            '@type': 'Person',
            name: siteConfig.legalName,
        },
    };
}

export function buildWebPageSchema({ locale, pathname = '', title, description, pageType = 'WebPage' }) {
    const normalizedPath = pathname ? (pathname.startsWith('/') ? pathname : `/${pathname}`) : '';
    const url = toAbsoluteUrl(`/${locale}${normalizedPath}`);

    return {
        '@context': 'https://schema.org',
        '@type': pageType,
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: localeToLanguageTag[locale] ?? locale,
        isPartOf: {
            '@id': toAbsoluteUrl(`/${locale}#website`),
        },
        about: {
            '@id': toAbsoluteUrl(`/${locale}#person`),
        },
        primaryImageOfPage: {
            '@type': 'ImageObject',
            url: toAbsoluteUrl(siteConfig.ogImage),
        },
    };
}

export function buildBreadcrumbSchema({ locale, items }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: toAbsoluteUrl(`/${locale}${item.pathname}`),
        })),
    };
}

export function buildItemListSchema({ locale, pathname, name, items }) {
    const basePath = `/${locale}${pathname}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        url: toAbsoluteUrl(basePath),
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: item.pathname ? toAbsoluteUrl(`/${locale}${item.pathname}`) : toAbsoluteUrl(`${basePath}#${item.id}`),
            name: item.name,
            description: item.description,
        })),
    };
}
