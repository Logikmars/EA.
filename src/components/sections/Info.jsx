import '../../styles/Info.scss';
import { useTranslations } from 'next-intl';
import InfoBlock from '../ui/InfoBlock';
import Text from '../ui/Text';

const Info = () => {
    const t = useTranslations('Info');

    const els = [
        {
            amount: t('stats.years.amount'),
            description: t('stats.years.description'),
        },
        {
            amount: t('stats.ventures.amount'),
            description: t('stats.ventures.description'),
        },
        {
            amount: t('stats.campaigns.amount'),
            description: t('stats.campaigns.description'),
        },
    ];

    const texts = [
        t('paragraphs.first'),
        t('paragraphs.second'),
        t('paragraphs.third'),
    ];

    return (
        <section className='Info' id='about'>
            <div className='Info_container container'>
                <div className='Info_list'>
                    {els.map((el) => (
                        <InfoBlock amount={el.amount} description={el.description} key={`InfoBlock_ley_${el.amount}_${el.description}`} />
                    ))}
                </div>
                <div className='Info_text'>
                    {texts.map((el) => (
                        <Text white fw_medium fs_xl key={`Info_text_key_${el}`}>
                            {el}
                        </Text>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Info;
