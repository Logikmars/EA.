import StructuredData from '@/components/seo/StructuredData';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import { getMediaItems, getProjects } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { buildItemListSchema, buildWebPageSchema } from '@/lib/schema';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const Info = dynamic(() => import('@/components/sections/Info'));
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
    const projects = getProjects(locale);
    const mediaItems = getMediaItems(locale);
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
                id: project.slug,
                name: project.title,
                description: project.summary,
                pathname: `/projects/${project.slug}`,
            })),
        }),
        buildItemListSchema({
            locale,
            pathname: '/media',
            name: 'Media',
            items: mediaItems.map((media) => ({
                id: media.slug,
                name: media.title,
                description: media.type,
                pathname: `/media/${media.slug}`,
            })),
        }),
    ];

    return (
        <div className='page'>
            <StructuredData data={structuredData} />
            <Hero />
            <Info />
            <Projects />
            <Cooperation />
            <Media />
            <MainForm />
        </div>
    );
};

export default HomePage;
