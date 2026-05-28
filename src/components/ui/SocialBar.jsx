import Image from 'next/image';
import '../../styles/SocialBar.scss';

const SocialBar = () => {

    const els = [
        {
            img: 'telegram.svg',
            alt: 'Telegram profile',
            href: 'https://t.me/PhygitalFather'
        },
        {
            img: 'facebook.svg',
            alt: 'Facebook profile',
            href: 'https://www.facebook.com/profile.php?id=100009048985540'
        },
        {
            img: 'linkedin.svg',
            alt: 'LinkedIn profile',
            href: 'https://www.linkedin.com/in/eduardo-akhramovych-533510150/?original_referer='
        },
        {
            img: 'youtube.svg',
            alt: 'YouTube channel',
            href: 'https://www.youtube.com/@Akhramovych'
        },
        {
            img: 'wikipedia.svg',
            alt: 'Wikipedia page',
            href: 'https://uk.wikipedia.org/wiki/%D0%90%D1%85%D1%80%D0%B0%D0%BC%D0%BE%D0%B2%D0%B8%D1%87_%D0%95%D0%B4%D1%83%D0%B0%D1%80%D0%B4_%D0%A1%D1%82%D0%B0%D0%BD%D1%96%D1%81%D0%BB%D0%B0%D0%B2%D0%BE%D0%B2%D0%B8%D1%87'
        }
    ];

    return (
        <div className='SocialBar'>
            {els.map((el, index) => (
                <a
                    href={el.href}
                    className='SocialBar_el'
                    key={`SocialBar_el_key_${el.img}_${index}`}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Image
                        src={`/imgs/icons/${el.img}`}
                        alt={el.alt}
                        width={32}
                        height={32}
                        className='SocialBar_el_img'
                    />
                </a>
            ))}
        </div>
    );
};

export default SocialBar;
