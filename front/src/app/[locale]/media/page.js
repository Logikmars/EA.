import MediaCatalog from '@/components/sections/MediaCatalog';
import StructuredData from '@/components/seo/StructuredData';
import Text from '@/components/ui/Text';
import { getMediaItems } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { buildBreadcrumbSchema, buildItemListSchema, buildWebPageSchema } from '@/lib/schema';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../../../styles/MediaPage.scss';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations('SEO');

    return buildMetadata({
        locale,
        title: t('mediaTitle'),
        description: t('mediaDescription'),
        pathname: '/media',
        siteName: t('siteTitle'),
        keywords: locale === 'en'
            ? ['business interviews', 'retail podcasts', 'brand licensing articles', 'loyalty strategy media']
            : ['бізнес інтервʼю', 'статті про ритейл', 'подкасти про лояльність', 'медіа про ліцензування'],
    });
}

const MediaPage = async ({ params }) => {
    const { locale } = await params;

    setRequestLocale(locale);

    const seoT = await getTranslations('SEO');
    const t = await getTranslations('MediaPage');
    const mediaItems = await getMediaItems(locale);
    const structuredData = [
        buildWebPageSchema({
            locale,
            pathname: '/media',
            title: seoT('mediaTitle'),
            description: seoT('mediaDescription'),
            pageType: 'CollectionPage',
        }),
        buildBreadcrumbSchema({
            locale,
            items: [
                { name: seoT('homeTitle'), pathname: '' },
                { name: seoT('mediaTitle'), pathname: '/media' },
            ],
        }),
        buildItemListSchema({
            locale,
            pathname: '/media',
            name: seoT('mediaTitle'),
            items: mediaItems.map((media) => ({
                name: media.title,
                description: media.type,
                url: media.sourceUrl,
            })),
        }),
    ];

    return (
        <div className='MediaPage'>
            <StructuredData data={structuredData} />
            
            <Text h1 fw_bold fs_2xl>
                {t('title')}
            </Text>
            <MediaCatalog
                initialItems={mediaItems}
                locale={locale}
                clearLabel={t('clearFilters')}
                emptyLabel={t('empty')}
            />
        </div>
    );
};

export default MediaPage;
