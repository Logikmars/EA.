import { siteConfig } from '@/lib/site';

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/admin/', '/admin/login'],
            },
        ],
        sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
        host: siteConfig.siteUrl,
    };
}
