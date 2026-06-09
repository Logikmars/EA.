import StructuredData from '@/components/seo/StructuredData';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import Info from '@/components/sections/Info';
import Achivment from '@/components/sections/Achivment';
import { getMediaItems, getProjects } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { buildFAQPageSchema, buildItemListSchema, buildWebPageSchema } from '@/lib/schema';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Faq from '@/components/sections/Faq';

const Projects = dynamic(() => import('@/components/sections/Projects'));
const Cooperation = dynamic(() => import('@/components/sections/Cooperation'));
const Media = dynamic(() => import('@/components/sections/Media'));
const MainForm = dynamic(() => import('@/components/sections/MainForm'));

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations('SEO');

    return buildMetadata({
        locale,
        title: t('homeTitle'),
        description: t('homeDescription'),
        siteName: t('siteTitle'),
        keywords: locale === 'en'
            ? [
                'Eduard Akhramovych speaker',
                'business keynote speaker',
                'brand licensing consultant',
                'loyalty strategy consultant',
                'retail growth expert',
            ]
            : [
                'Едуард Ахрамович спікер',
                'бізнес спікер',
                'консультація з маркетингу',
                'ліцензування брендів',
                'програми лояльності',
            ],
    });
}

const HomePage = async ({ params }) => {
    const { locale } = await params;

    setRequestLocale(locale);
    const seoT = await getTranslations('SEO');
    const faqT = await getTranslations('Faq');
    const [projects, mediaItems] = await Promise.all([
        getProjects(locale),
        getMediaItems(locale),
    ]);
    const faqItems = Array.from({ length: 6 }, (_, index) => ({
        question: faqT(`items.${index}.question`),
        answer: faqT(`items.${index}.answer`),
    }));
    const structuredData = [
        buildWebPageSchema({
            locale,
            title: seoT('homeTitle'),
            description: seoT('homeDescription'),
        }),
        buildItemListSchema({
            locale,
            pathname: '/projects',
            name: 'Projects',
            items: projects.map((project) => ({
                name: project.title,
                description: project.summary,
                url: project.href,
            })),
        }),
        buildItemListSchema({
            locale,
            pathname: '/media',
            name: 'Media',
            items: mediaItems.map((media) => ({
                name: media.title,
                description: media.type,
                url: media.sourceUrl,
            })),
        }),
        buildFAQPageSchema({
            locale,
            questions: faqItems,
        }),
    ];

    return (
        <div className='page'>
            <StructuredData data={structuredData} />
            <Hero />
            <Info />
            <Projects locale={locale} projects={projects} />
            <Cooperation />
            <Achivment />
            <Media locale={locale} mediaItems={mediaItems} />
            <Faq />
            <MainForm />
        </div>
    );
};

export default HomePage;
