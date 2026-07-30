'use client';

import '../../styles/ExpertiseSections.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Btn from '../ui/Btn';
import Text from '../ui/Text';

export const Clients = () => {
    const t = useTranslations('Clients');
    const clients = [
        { name: 'ATB', file: 'atb.webp' },
        { name: 'Aurora', file: 'aurora.webp' },
        { name: 'Watsons', file: 'watsons.webp' },
        { name: 'Varus', file: 'varus.webp' },
        { name: 'MHP', file: 'mhp.webp' },
        { name: 'Fora', file: 'fora.webp' },
        { name: 'Carrefour', file: 'carrefour.webp' },
        { name: 'SPAR', file: 'spar.webp' },
        { name: 'Morshynska', file: 'morshynska.webp' },
        { name: 'Danone', file: 'danone.webp' },
    ];

    return (
        <section className='Clients container'>
            <div className='Clients_heading'>
                <Text h2 fw_semibold fs_2xl>{t('title')}</Text>
                <Text light_gray fs_l>{t('description')}</Text>
            </div>
            <div className='Clients_list'>
                {clients.map((client) => (
                    <div className='Clients_item' key={client.file}>
                        <Image
                            className='Clients_logo'
                            src={`/imgs/clients/${client.file}`}
                            alt={`${client.name} logo`}
                            width={1000}
                            height={400}
                            sizes='(max-width: 900px) 40vw, 260px'
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export const TrackRecord = () => {
    const t = useTranslations('TrackRecord');

    return (
        <section className='TrackRecord'>
            <div className='TrackRecord_container container'>
                <Text h2 fw_semibold fs_2xl>{t('title')}</Text>
                <div className='TrackRecord_grid'>
                    <article className='TrackRecord_methodology'>
                        <Text h3 fw_semibold fs_xl>{t('items.methodology.title')}</Text>
                        <Text light_gray fs_m>{t('items.methodology.description')}</Text>
                    </article>
                    <div className='TrackRecord_metrics'>
                        <article className='TrackRecord_metric TrackRecord_metric__blue'>
                            <Text fw_bold fs_2xl>{t('items.cohorts.value')}</Text>
                            <Text h3 fw_semibold fs_l>{t('items.cohorts.title')}</Text>
                            <Text light_gray fs_m>{t('items.cohorts.description')}</Text>
                        </article>
                        <article className='TrackRecord_metric TrackRecord_metric__green'>
                            <Text fw_bold fs_2xl>{t('items.growth.value')}</Text>
                            <Text h3 fw_semibold fs_l>{t('items.growth.title')}</Text>
                            <Text light_gray fs_m>{t('items.growth.description')}</Text>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const BusinessReviews = () => {
    const t = useTranslations('BusinessReviews');

    return (
        <section className='BusinessReviews container'>
            <div className='BusinessReviews_copy'>
                <Text h2 fw_semibold fs_2xl>{t('title')}</Text>
                <Text light_gray fs_l>{t('description')}</Text>
            </div>
            <div className='BusinessReviews_media'>
                <span className='BusinessReviews_play' aria-hidden='true'>▶</span>
                <div>
                    <Text white fw_semibold fs_xl>{t('mediaTitle')}</Text>
                    <Text white fs_m>{t('mediaDescription')}</Text>
                </div>
                <Btn color_blue fw_medium href='https://www.youtube.com/@Akhramovych'>{t('button')}</Btn>
            </div>
        </section>
    );
};

export const CreativeBusiness = () => {
    const t = useTranslations('CreativeBusiness');

    return (
        <section className='CreativeBusiness'>
            <div className='CreativeBusiness_container container'>
                <Text h2 fw_semibold fs_2xl>{t('title')}</Text>
                <div className='CreativeBusiness_grid'>
                    <article className='CreativeBusiness_lead'>
                        <Text h3 white fw_semibold fs_xl>{t('studioTitle')}</Text>
                        <Text white fs_l>{t('studioDescription')}</Text>
                    </article>
                    <article className='CreativeBusiness_card'>
                        <Text h3 fw_semibold fs_l>{t('worksTitle')}</Text>
                        <Text light_gray fs_m>{t('works')}</Text>
                    </article>
                    <article className='CreativeBusiness_card'>
                        <Text h3 fw_semibold fs_l>{t('peopleTitle')}</Text>
                        <Text light_gray fs_m>{t('people')}</Text>
                    </article>
                </div>
            </div>
        </section>
    );
};
