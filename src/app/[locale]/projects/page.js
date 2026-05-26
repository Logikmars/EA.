import ProjectBlock from '@/components/ui/ProjectBlock';
import AnimatedRevealList from '@/components/ui/AnimatedRevealList';
import StructuredData from '@/components/seo/StructuredData';
import Text from '@/components/ui/Text';
import { getProjects } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { buildBreadcrumbSchema, buildItemListSchema, buildWebPageSchema } from '@/lib/schema';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../../../styles/ProjectsPage.scss';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations('SEO');

    return buildMetadata({
        locale,
        title: t('projectsTitle'),
        description: t('projectsDescription'),
        pathname: '/projects',
        siteName: t('siteTitle'),
        keywords: locale === 'en'
            ? ['business case studies', 'retail case studies', 'brand licensing projects', 'consumer products projects']
            : ['бізнес кейси', 'проєкти з ритейлу', 'ліцензування брендів кейси', 'споживчі продукти'],
    });
}

const ProjectsPage = async ({ params }) => {
    const { locale } = await params;

    setRequestLocale(locale);

    const seoT = await getTranslations('SEO');
    const t = await getTranslations('ProjectsPage');
    const projectItems = getProjects(locale);
    const structuredData = [
        buildWebPageSchema({
            locale,
            pathname: '/projects',
            title: seoT('projectsTitle'),
            description: seoT('projectsDescription'),
            pageType: 'CollectionPage',
        }),
        buildBreadcrumbSchema({
            locale,
            items: [
                { name: seoT('homeTitle'), pathname: '' },
                { name: seoT('projectsTitle'), pathname: '/projects' },
            ],
        }),
        buildItemListSchema({
            locale,
            pathname: '/projects',
            name: seoT('projectsTitle'),
            items: projectItems.map((project) => ({
                id: project.slug,
                name: project.title,
                description: project.summary,
                pathname: `/projects/${project.slug}`,
            })),
        }),
    ];

    return (
        <div className='ProjectsPage'>
            <StructuredData data={structuredData} />
            <Text h1 fw_bold fs_2xl>
                {t('title')}
            </Text>
            <AnimatedRevealList className='ProjectsPage_list' itemSelector='.ProjectBlock'>
                {projectItems.map((project) => (
                    <ProjectBlock
                        id={project.slug}
                        key={project.slug}
                        img={project.img}
                        title={project.title}
                        description={project.summary}
                        alt={project.title}
                        href={`/projects/${project.slug}`}
                    />
                ))}
            </AnimatedRevealList>
        </div>
    );
};

export default ProjectsPage;
