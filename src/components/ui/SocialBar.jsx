import Link from 'next/link';
import '../../styles/SocialBar.scss';
export default () => {

    const els = [
        {
            img: 'telegram.svg',
            alt: '#',
            href: '#'
        },
        {
            img: 'facebook.svg',
            alt: '#',
            href: '#'
        },
        {
            img: 'linkedin.svg',
            alt: '#',
            href: '#'
        },
        {
            img: 'youtube.svg',
            alt: '#',
            href: "#"
        },
        {
            img: 'wikipedia.svg',
            alt: '#',
            href: '#'
        }
    ]

    return (
        <div className='SocialBar'>
            {
                els.map((el, index) => (
                    <Link href={el.href} className='SocialBar_el' key={`SocialBar_el_key_${el.img}_${index}`}>
                        <img src={`/imgs/icons/${el.img}`} alt={el.alt} className='SocialBar_el_img' />
                    </Link>
                ))
            }
        </div>
    )
}