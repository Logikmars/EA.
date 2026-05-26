import { projectsStore } from '@/stores';
import '../../styles/Projects.scss';
import Btn from '../ui/Btn';
import ProjectBlock from '../ui/ProjectBlock';
import Text from '../ui/Text';
export default () => {

    return (
        <section className='Projects container' id='projects'>
            <div className='Projects_top'>
                <Text h2 fw_semibold fs_2xl>
                    ПРОЄКТИ
                </Text>
                <Btn color_transparent text_black fw_medium href={'/projects'}>
                    Усі проєкти
                </Btn>
            </div>
            <div className='Projects_list'>
                {
                    projectsStore.projects.slice(0, 3).map((el, index) => (
                        <ProjectBlock img={el.img} title={el.title} description={el.description} alt={el.alt} key={`ProjectBlock_el_${index}`}/>
                    ))
                }
            </div>
        </section>
    )
}
