import '../../styles/Header.scss';
import Link from 'next/link';
import Btn from '../ui/Btn';
import Text from '../ui/Text';
export default () => {

    const links = [
        {
            title: 'About',
            href: '/#about'
        },
        {
            title: 'Projects',
            href: '/#projects'
        },
        {
            title: 'Collaboration',
            href: '/#collaboration'
        },
        {
            title: 'Media',
            href: '/#media'
        }
    ]

    return (
        <header className='Header'>
            <div className='Header_container container'>
                <Link className='Header_logo' href='/#top' aria-label='Go to top of homepage'>
                    <Text h1 fs_l fw_bold>
                        EA.
                    </Text>
                </Link>
                <nav className='Header_nav'>
                    {
                        links.map((el, index) => (
                            <Text styleClass='rotate' a fs_xs fw_medium href={el.href} key={`Header_links_key_${el.title}_${index}`}>
                                {el.title}
                            </Text>
                        ))
                    }
                </nav>
                <Btn color_blue fs_xs fw_medium href={'/invite'}>
                    Contact Eduard
                </Btn>
            </div>
        </header>
    )
}
