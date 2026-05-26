import StructuredData from '@/components/seo/StructuredData';
import Btn from '@/components/ui/Btn';
import Text from '@/components/ui/Text';
import { getMediaDetailCopy, getMediaItem, getMediaItems, getMediaStaticSlugs } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../../../../styles/CaseDetail.scss';

export function generateStaticParams() {
    return getMediaStaticSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params;
    const mediaItem = getMediaItem(locale, slug);
    const t = await getTranslations('SEO');

    if (!mediaItem) {
        return buildMetadata({
            locale,
            title: t('mediaTitle'),
            description: t('mediaDescription'),
            pathname: '/media',
            siteName: t('siteTitle'),
        });
    }

    return buildMetadata({
        locale,
        title: `${mediaItem.title} | ${t('mediaTitle')}`,
        description: mediaItem.summary,
        pathname: `/media/${mediaItem.slug}`,
        siteName: t('siteTitle'),
        keywords: [
            mediaItem.title,
            mediaItem.type,
            mediaItem.outlet,
            ...(locale === 'en'
                ? ['business media', 'retail interview', 'brand licensing insights', 'loyalty programs']
                : ['бізнес медіа', 'інтервʼю про ритейл', 'ліцензування брендів', 'програми лояльності']),
        ],
        openGraphType: 'article',
    });
}

export default async function MediaDetailPage({ params }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const mediaItem = getMediaItem(locale, slug);

    if (!mediaItem) {
        notFound();
    }

    const seoT = await getTranslations('SEO');
    const detailCopy = getMediaDetailCopy(locale);
    const relatedItems = getMediaItems(locale).filter((item) => item.slug !== slug).slice(0, 3);
    const typeKey = mediaItem.type.toLowerCase();
    const paragraphs = detailCopy.paragraphs[typeKey] ?? detailCopy.paragraphs.article;
    const structuredData = [
        buildWebPageSchema({
            locale,
            pathname: `/media/${mediaItem.slug}`,
            title: mediaItem.title,
            description: mediaItem.summary,
            pageType: 'ArticlePage',
        }),
        buildBreadcrumbSchema({
            locale,
            items: [
                { name: seoT('homeTitle'), pathname: '' },
                { name: seoT('mediaTitle'), pathname: '/media' },
                { name: mediaItem.title, pathname: `/media/${mediaItem.slug}` },
            ],
        }),
        {
            '@context': 'https://schema.org',
            '@type': ['video', 'відео'].includes(mediaItem.type) ? 'VideoObject' : ['podcast', 'подкаст'].includes(mediaItem.type) ? 'PodcastEpisode' : 'Article',
            name: mediaItem.title,
            description: mediaItem.summary,
            publisher: mediaItem.outlet,
            url: mediaItem.sourceUrl,
        },
    ];

    return (
        <section className='CaseDetail'>
            <StructuredData data={structuredData} />
            <div className='CaseDetail_container container'>
                <div className='CaseDetail_hero'>
                    <div className='CaseDetail_content'>
                        <Text fs_xs fw_semibold className='CaseDetail_eyebrow'>
                            {mediaItem.type}
                        </Text>
                        <Text h1 fs_2xl fw_bold className='CaseDetail_title'>
                            {mediaItem.title}
                        </Text>
                        <Text fs_l className='CaseDetail_summary'>
                            {mediaItem.summary}
                        </Text>
                        <div className='CaseDetail_body'>
                            <Text fs_l fw_semibold>{detailCopy.overviewLabel}</Text>
                            {paragraphs.map((paragraph) => (
                                <Text fs_m key={paragraph}>
                                    {paragraph}
                                </Text>
                            ))}
                        </div>
                        <div className='CaseDetail_actions'>
                            <Btn color_blue fw_medium href='/invite'>
                                {detailCopy.contactCta}
                            </Btn>
                            <Btn color_transparent text_black fw_medium href='/media'>
                                {detailCopy.allMediaCta}
                            </Btn>
                        </div>
                    </div>
                    <div className='CaseDetail_sidebar'>
                        <div className='CaseDetail_card'>
                            <Text fs_l fw_semibold>{detailCopy.sourceLabel}</Text>
                            <Text fs_m>{mediaItem.outlet}</Text>
                            <Btn color_transparent text_black fw_medium href={mediaItem.sourceUrl}>
                                {mediaItem.sourceLabel}
                            </Btn>
                        </div>
                        <div className='CaseDetail_card'>
                            <Text fs_l fw_semibold>{detailCopy.relatedTopicsLabel}</Text>
                            <div className='CaseDetail_tags'>
                                {mediaItem.summary.split(',').slice(0, 3).map((chunk) => (
                                    <span className='CaseDetail_tag' key={chunk}>
                                        {chunk.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {relatedItems.length ? (
                    <div className='CaseDetail_card'>
                        <Text fs_l fw_semibold>{detailCopy.allMediaCta}</Text>
                        <div className='CaseDetail_tags'>
                            {relatedItems.map((item) => (
                                <a className='CaseDetail_backLink' href={`/${locale}/media/${item.slug}`} key={item.slug}>
                                    {item.title}
                                </a>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
