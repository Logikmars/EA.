import { Link } from '@/i18n/navigation';
import '../../styles/NotFound.scss';
import Btn from '../ui/Btn';
import Text from '../ui/Text';

const NotFoundPage = ({ title, description, primaryCta, secondaryCta, linksLabel, locale }) => {
    const localizedLinks = [
        {
            href: '/',
            label: locale === 'ua' ? 'Головна' : 'Home',
        },
        {
            href: '/projects',
            label: locale === 'ua' ? 'Проєкти' : 'Projects',
        },
        {
            href: '/media',
            label: locale === 'ua' ? 'Медіа' : 'Media',
        },
        {
            href: '/invite',
            label: locale === 'ua' ? 'Запросити Едуарда' : 'Invite Eduard',
        },
    ];

    return (
        <section className='NotFound'>
            <div className='NotFound_card'>
                <Text fs_xs fw_semibold className='NotFound_eyebrow'>
                    404
                </Text>
                <Text h1 fs_2xl fw_bold className='NotFound_title'>
                    {title}
                </Text>
                <Text fs_l className='NotFound_description'>
                    {description}
                </Text>
                <div className='NotFound_actions'>
                    <Btn color_blue fw_medium href='/'>
                        {primaryCta}
                    </Btn>
                    <Btn color_transparent text_black fw_medium href='/invite'>
                        {secondaryCta}
                    </Btn>
                </div>
                <Text fs_m className='NotFound_hint'>
                    {linksLabel}
                </Text>
                <div className='NotFound_links'>
                    {localizedLinks.map((item) => (
                        <Link className='NotFound_link' href={item.href} key={item.href}>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;
