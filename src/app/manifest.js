import { siteConfig } from '@/lib/site';

export default function manifest() {
    return {
        name: siteConfig.siteName,
        short_name: 'Akhramovych',
        description: 'Entrepreneur, speaker and founder of Art Nation.',
        start_url: '/ua',
        display: 'standalone',
        background_color: '#f3f0e8',
        theme_color: '#1c5cff',
    };
}
