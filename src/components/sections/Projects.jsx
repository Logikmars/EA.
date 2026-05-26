import { projectsStore } from '@/stores';
import '../../styles/Projects.scss';
import { useTranslations } from 'next-intl';
import Btn from '../ui/Btn';
import ProjectBlock from '../ui/ProjectBlock';
import Text from '../ui/Text';

const Projects = () => {
    const t = useTranslations('Projects');
    const projectsT = useTranslations('ProjectItems');

    return (
        <section className='Projects container' id='projects'>
            <div className='Projects_top'>
                <Text h2 fw_semibold fs_2xl>
                    {t('title')}
                </Text>
                <Btn color_transparent text_black fw_medium href='/projects'>
                    {t('all')}
                </Btn>
            </div>
            <div className='Projects_list'>
                {projectsStore.projects.slice(0, 3).map((el) => (
                    <ProjectBlock
                        img={el.img}
                        title={projectsT(`${el.id}.title`)}
                        description={projectsT(`${el.id}.description`)}
                        alt={projectsT(`${el.id}.alt`)}
                        key={el.id}
                    />
                ))}
            </div>
        </section>
    );
};

export default Projects;
