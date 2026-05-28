import MainForm from '@/components/sections/MainForm';
import StructuredData from '@/components/seo/StructuredData';
import { buildMetadata } from '@/lib/seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../../../styles/Invite.scss';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations('SEO');

    return buildMetadata({
        locale,
        title: t('inviteTitle'),
        description: t('inviteDescription'),
        pathname: '/invite',
        siteName: t('siteTitle'),
        keywords: locale === 'en'
            ? ['book keynote speaker', 'hire business consultant', 'invite entrepreneur speaker', 'brand licensing advisor']
            : ['запросити спікера', 'бізнес консультант', 'стратегічна консультація', 'запросити Едуарда Ахрамовича'],
        openGraphType: 'profile',
    });
}

const InvitePage = async ({ params }) => {
    const { locale } = await params;

    setRequestLocale(locale);
    const seoT = await getTranslations('SEO');
    const structuredData = [
        buildWebPageSchema({
            locale,
            pathname: '/invite',
            title: seoT('inviteTitle'),
            description: seoT('inviteDescription'),
            pageType: 'ContactPage',
        }),
        buildBreadcrumbSchema({
            locale,
            items: [
                { name: seoT('homeTitle'), pathname: '' },
                { name: seoT('inviteTitle'), pathname: '/invite' },
            ],
        }),
    ];

    return (
        <>
            <StructuredData data={structuredData} />
            <MainForm />
        </>
    );
};

export default InvitePage;
