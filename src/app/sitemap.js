import { getMediaStaticSlugs, getProjectStaticSlugs } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site';

const staticPages = ['', '/projects', '/media', '/invite'];
const projectPages = getProjectStaticSlugs().map((slug) => `/projects/${slug}`);
const mediaPages = getMediaStaticSlugs().map((slug) => `/media/${slug}`);
const allPages = [...staticPages, ...projectPages, ...mediaPages];

export default function sitemap() {
    const now = new Date();

    return routing.locales.flatMap((locale) => (
        allPages.map((pathname) => {
            const languages = Object.fromEntries(
                routing.locales.map((currentLocale) => [
                    currentLocale === 'ua' ? 'uk' : currentLocale,
                    `${siteConfig.siteUrl}/${currentLocale}${pathname}`,
                ])
            );

            return {
                url: `${siteConfig.siteUrl}/${locale}${pathname}`,
                lastModified: now,
                changeFrequency: pathname ? 'monthly' : 'weekly',
                priority: pathname ? 0.8 : 1,
                alternates: {
                    languages,
                },
            };
        })
    ));
}
