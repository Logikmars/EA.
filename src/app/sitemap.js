import { getMediaStaticSlugs, getProjectStaticSlugs } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site';

const staticPages = ['', '/projects', '/media', '/invite'];

export default async function sitemap() {
    const [projectSlugs, mediaSlugs] = await Promise.all([
        getProjectStaticSlugs(),
        getMediaStaticSlugs(),
    ]);
    const projectPages = projectSlugs.map((slug) => `/projects/${slug}`);
    const mediaPages = mediaSlugs.map((slug) => `/media/${slug}`);
    const allPages = [...staticPages, ...projectPages, ...mediaPages];
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
