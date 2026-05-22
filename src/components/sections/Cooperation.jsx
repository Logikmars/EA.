import '../../styles/Cooperation.scss';
import CooperationBlock from '../ui/CooperationBlock';
import Text from '../ui/Text';
export default () => {

    const els = [
        {
            img: '/imgs/icons/mic.svg',
            alt: '#',
            title: 'Лекція',
            description: 'Дізнайтеся секрети створення товарів-блокбастерів, організації системного відділу продажу, мислення каналами продажу, гейміфікацію, крос-промо та колаборації, розробку маркетингових стратегій, які захоплюють і надихають!',
            btnText: 'Замовити лекцію',
            href: '#'
        },
        {
            img: '/imgs/icons/users.svg',
            alt: '#',
            title: 'Публічний виступ',
            description: 'Шукаєте досвідченого експерта для вашого бізнес-заходу? Едуард поділиться цінними ідеями та практичним досвідом у сфері маркетингу, продажів,  гейміфікації, лоялті та ліцензування брендів.',
            btnText: 'Запросити на виступ',
            href: '#'
        },
        {
            img: '/imgs/icons/case.svg',
            alt: '#',
            title: 'Консультація',
            description: 'Маєте запитання про розвиток і масштабування бізнесу; перевірки бізнес-моделі або монетизації творчих проектів?Едуард зробить розбір Вашого бізнесу і запропонує робочі рішення.',
            btnText: 'Отримати консультацію',
            href: '#'
        }
    ]

    return (
        <div className='Cooperation'>
            <div className='Cooperation_container container'>
                <Text h2 fw_semibold fs_2xl>
                    СПІВПРАЦЯ
                </Text>
                <div className='Cooperation_list'>
                    {
                        els.map((el, index) => (
                            <CooperationBlock img={el.img} alt={el.alt} title={el.title} description={el.description} btnText={el.btnText} href={el.href} key={`CooperationBlock_el_key_${index}`} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}