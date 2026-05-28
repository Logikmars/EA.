export const siteConfig = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://akhramovych.com',
    siteName: 'Eduard Akhramovych',
    legalName: 'Eduard Akhramovych',
    organizationName: 'Art Nation',
    defaultLocale: 'ua',
    ogImage: '/imgs/EduardAkhramovych.webp',
    sameAs: [
        'https://www.facebook.com/profile.php?id=100009048985540',
        'https://www.linkedin.com/in/eduardo-akhramovych-533510150/?original_referer=',
        'https://uk.wikipedia.org/wiki/%D0%90%D1%85%D1%80%D0%B0%D0%BC%D0%BE%D0%B2%D0%B8%D1%87_%D0%95%D0%B4%D1%83%D0%B0%D1%80%D0%B4_%D0%A1%D1%82%D0%B0%D0%BD%D1%96%D1%81%D0%BB%D0%B0%D0%B2%D0%BE%D0%B2%D0%B8%D1%87',
        'https://www.youtube.com/@Akhramovych',
        'https://t.me/PhygitalFather',
    ],
};

export function toAbsoluteUrl(pathname = '/') {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

    return new URL(normalizedPath, siteConfig.siteUrl).toString();
}
