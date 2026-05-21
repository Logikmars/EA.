import '../../styles/Projects.scss';
import Btn from '../ui/Btn';
import ProjectBlock from '../ui/ProjectBlock';
import Text from '../ui/Text';
export default () => {

    const els = [
        {
            img: '/imgs/projects/1.png',
            title: 'Національна мультимедійна компанія',
            description: 'Створив дистрибуційну мережу з 4573 точок продажу ліцензійних компакт-дисків. У 2007 році досяг річного обігу 20 мільйонів $ США. Асортимент — понад 30 000 товарів.',
            alt: '#'
        },
        {
            img: '/imgs/projects/1.png',
            title: 'Art Nation',
            description: 'Продано понад 255 мільйонів колекційних товарів. Співпрацює з найбільшими ритейлерами України та СНД. Річний обіг наших клієнтів складає понад 200 мільярдів грн.',
            alt: '#'
        },
        {
            img: '/imgs/projects/1.png',
            title: 'Книга рекордів України',
            description: 'Рекордсмен України з продажу дитячих книжок — 1 мільйон 241 тисяча проданих примірників у 2018 році.',
            alt: '#'
        }
    ]

    return (
        <section className='Projects container'>
            <div className='Projects_top'>
                <Text h2 fw_semibold fs_2xl>
                    ПРОЄКТИ
                </Text>
                <Btn color_transparent text_black fw_medium>
                    Усі проєкти
                </Btn>
            </div>
            <div className='Projects_list'>
                {
                    els.map((el, index) => (
                        <ProjectBlock img={el.img} title={el.title} description={el.description} alt={el.alt} key={`ProjectBlock_el_${index}`}/>
                    ))
                }
            </div>
        </section>
    )
}