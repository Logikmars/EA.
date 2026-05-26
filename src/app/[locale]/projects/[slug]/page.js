import StructuredData from '@/components/seo/StructuredData';
import Btn from '@/components/ui/Btn';
import Text from '@/components/ui/Text';
import { getProject, getProjectDetailCopy, getProjects, getProjectStaticSlugs } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '@/lib/schema';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../../../../styles/CaseDetail.scss';

export function generateStaticParams() {
    return getProjectStaticSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { locale, slug } = await params;
    const project = getProject(locale, slug);
    const t = await getTranslations('SEO');

    if (!project) {
        return buildMetadata({
            locale,
            title: t('projectsTitle'),
            description: t('projectsDescription'),
            pathname: '/projects',
            siteName: t('siteTitle'),
        });
    }

    return buildMetadata({
        locale,
        title: `${project.title} | ${t('projectsTitle')}`,
        description: project.summary,
        pathname: `/projects/${project.slug}`,
        siteName: t('siteTitle'),
        keywords: [
            project.title,
            ...project.tags,
            ...(locale === 'en'
                ? ['business case study', 'growth strategy case', 'retail execution']
                : ['бізнес кейс', 'стратегія зростання', 'ритейл кейс']),
        ],
        openGraphType: 'article',
    });
}

export default async function ProjectDetailPage({ params }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const project = getProject(locale, slug);

    if (!project) {
        notFound();
    }

    const seoT = await getTranslations('SEO');
    const detailCopy = getProjectDetailCopy(locale);
    const allProjects = getProjects(locale);
    const relatedProjects = allProjects.filter((item) => item.slug !== slug).slice(0, 2);
    const structuredData = [
        buildWebPageSchema({
            locale,
            pathname: `/projects/${project.slug}`,
            title: project.title,
            description: project.summary,
            pageType: 'ArticlePage',
        }),
        buildBreadcrumbSchema({
            locale,
            items: [
                { name: seoT('homeTitle'), pathname: '' },
                { name: seoT('projectsTitle'), pathname: '/projects' },
                { name: project.title, pathname: `/projects/${project.slug}` },
            ],
        }),
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: project.title,
            description: project.summary,
            keywords: project.tags.join(', '),
            about: project.tags,
        },
    ];

    return (
        <section className='CaseDetail'>
            <StructuredData data={structuredData} />
            <div className='CaseDetail_container container'>
                <div className='CaseDetail_hero'>
                    <div className='CaseDetail_content'>
                        <Text fs_xs fw_semibold className='CaseDetail_eyebrow'>
                            {seoT('projectsTitle')}
                        </Text>
                        <Text h1 fs_2xl fw_bold className='CaseDetail_title'>
                            {project.title}
                        </Text>
                        <Text fs_l className='CaseDetail_summary'>
                            {project.summary}
                        </Text>
                        <div className='CaseDetail_body'>
                            <Text fs_l fw_semibold>{detailCopy.headline}</Text>
                            <Text fs_m>{project.intro}</Text>
                            {project.paragraphs.map((paragraph) => (
                                <Text fs_m key={paragraph}>
                                    {paragraph}
                                </Text>
                            ))}
                        </div>
                        <div className='CaseDetail_actions'>
                            <Btn color_blue fw_medium href='/invite'>
                                {detailCopy.contactCta}
                            </Btn>
                            <Btn color_transparent text_black fw_medium href='/projects'>
                                {detailCopy.backLabel}
                            </Btn>
                        </div>
                    </div>
                    <div className='CaseDetail_sidebar'>
                        <div className='CaseDetail_card'>
                            <Text fs_l fw_semibold>{detailCopy.proofLabel}</Text>
                            <ul className='CaseDetail_list'>
                                {project.highlights.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='CaseDetail_card'>
                            <Text fs_l fw_semibold>{detailCopy.nextStep}</Text>
                            <div className='CaseDetail_tags'>
                                {project.tags.map((tag) => (
                                    <span className='CaseDetail_tag' key={tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {project.reference ? (
                            <div className='CaseDetail_card'>
                                <Text fs_l fw_semibold>{detailCopy.referenceLabel}</Text>
                                <a
                                    className='CaseDetail_backLink'
                                    href={project.reference.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    {project.reference.label}
                                </a>
                            </div>
                        ) : null}
                    </div>
                </div>
                {relatedProjects.length ? (
                    <div className='CaseDetail_card'>
                        <Text fs_l fw_semibold>{detailCopy.backLabel}</Text>
                        <div className='CaseDetail_tags'>
                            {relatedProjects.map((item) => (
                                <a className='CaseDetail_backLink' href={`/${locale}/projects/${item.slug}`} key={item.slug}>
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
