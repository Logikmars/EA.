import '../../styles/Cooperation.scss';
import { useTranslations } from 'next-intl';
import CooperationBlock from '../ui/CooperationBlock';
import Text from '../ui/Text';

const Cooperation = () => {
    const t = useTranslations('Cooperation');

    const els = [
        {
            id: 'lecture',
            img: '/imgs/icons/mic.svg',
            alt: '#',
            href: '#',
        },
        {
            id: 'speech',
            img: '/imgs/icons/users.svg',
            alt: '#',
            href: '#',
        },
        {
            id: 'consulting',
            img: '/imgs/icons/case.svg',
            alt: '#',
            href: '#',
        },
    ];

    return (
        <section className='Cooperation' id='collaboration'>
            <div className='Cooperation_container container'>
                <Text h2 fw_semibold fs_2xl>
                    {t('title')}
                </Text>
                <div className='Cooperation_list'>
                    {els.map((el) => (
                        <CooperationBlock
                            img={el.img}
                            alt={el.alt}
                            title={t(`items.${el.id}.title`)}
                            description={t(`items.${el.id}.description`)}
                            btnText={t(`items.${el.id}.button`)}
                            href={el.href}
                            key={el.id}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Cooperation;
