import ProjectBlock from '@/components/ui/ProjectBlock';
import Text from '@/components/ui/Text';
import { buildMetadata } from '@/lib/seo';
import { projectsStore } from '@/stores';
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
    });
}

const ProjectsPage = async ({ params }) => {
    const { locale } = await params;

    setRequestLocale(locale);

    const t = await getTranslations('ProjectsPage');
    const projectsT = await getTranslations('ProjectItems');

    return (
        <div className='ProjectsPage'>
            <Text h1 fw_bold fs_2xl>
                {t('title')}
            </Text>
            <div className='ProjectsPage_list'>
                {projectsStore.projects.map((el) => (
                    <ProjectBlock
                        key={el.id}
                        img={el.img}
                        title={projectsT(`${el.id}.title`)}
                        description={projectsT(`${el.id}.description`)}
                        alt={projectsT(`${el.id}.alt`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;
