import Text from "@/components/ui/Text";
import "../../styles/ProjectsPage.scss";
import { projectsStore } from "@/stores";
import ProjectBlock from "@/components/ui/ProjectBlock";


export default function ProjectPage() {
  return (
      <div className="ProjectsPage">
          <Text h1 fw_bold fs_2xl>
              Усі проекти
          </Text>
          <div className='ProjectsPage_list'>
              {
                  projectsStore.projects.map((el, index) => (
                      <ProjectBlock img={el.img} title={el.title} description={el.description} alt={el.alt} key={`ProjectBlock_el_${index}`}/>
                  ))
              }
          </div>
      </div>
  );
}
