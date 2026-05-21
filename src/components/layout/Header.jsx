import '../../styles/Header.scss';
import Btn from '../ui/Btn';
import Text from '../ui/Text';
export default () => {

    const links = [
        {
            title: 'About',
            href: '#'
        },
        {
            title: 'Projects',
            href: '#'
        },
        {
            title: 'Collaboration',
            href: '#'
        },
        {
            title: 'Media',
            href: '#'
        }
    ]

    return (
        <header className='Header'>
            <div className='Header_container container'>
                <Text h1 fs_l fw_bold>
                    EA.
                </Text>
                <nav className='Header_nav'>
                    {
                        links.map((el, index) => (
                            <Text styleClass='rotate' a fs_xs fw_medium href={el.href} key={`Header_links_key_${el.title}_${index}`}>
                                {el.title}
                            </Text>
                        ))
                    }
                </nav>
                <Btn color_blue fs_xs fw_medium>
                    Contact Eduard
                </Btn>
            </div>
        </header>
    )
}