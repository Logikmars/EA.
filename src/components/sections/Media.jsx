import '../../styles/Media.scss';
import Btn from '../ui/Btn';
import MediaBlock from '../ui/MediaBlock';
import Text from '../ui/Text';
export default () => {

    const els = [
        {
            img: '/imgs/projects/1.png',
            href: '#',
            alt: '#',
            type: 'video',
            text: 'The Future of Retail and Consumer Loyalty'
        },
        {
            img: '/imgs/projects/1.png',
            href: '#',
            alt: '#',
            type: 'article',
            text: 'Why most loyalty campaigns fail in the first year'
        },
        {
            img: '/imgs/projects/1.png',
            href: '#',
            alt: '#',
            type: 'inteview',
            text: 'Building Art Nation: From Concept to Empire'
        },
        {
            img: '/imgs/projects/1.png',
            href: '#',
            alt: '#',
            type: 'podcast',
            text: 'Navigating the European Market Expansion'
        }
    ]
    
    return (
        <section className='Media container'>
            <div className='Media_top'>
                <Text h2 fw_semibold fs_2xl>
                    Медіа
                </Text>
                <Btn color_transparent text_black fw_medium>
                    Усі медіа
                </Btn>
            </div>
            <div className='Media_list'>
                {
                    els.map((el, index) => (
                        <MediaBlock type={el.type} img={el.img} text={el.text} href={el.href} alt={el.alt} key={`MediaBlock_el_key_${index}`}/>
                    ))
                }
            </div>
        </section>
    )
}