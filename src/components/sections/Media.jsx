import MediaStore from '@/stores/MediaStore';
import '../../styles/Media.scss';
import { useTranslations } from 'next-intl';
import Btn from '../ui/Btn';
import MediaBlock from '../ui/MediaBlock';
import Text from '../ui/Text';

const Media = () => {
    const t = useTranslations('Media');
    const mediaT = useTranslations('MediaItems');

    return (
        <section className='Media container' id='media'>
            <div className='Media_top'>
                <Text h2 fw_semibold fs_2xl>
                    {t('title')}
                </Text>
                <Btn color_transparent text_black fw_medium href='/media'>
                    {t('all')}
                </Btn>
            </div>
            <div className='Media_list'>
                {MediaStore.medias.slice(0, 4).map((el) => (
                    <MediaBlock
                        type={mediaT(`${el.id}.type`)}
                        img={el.img}
                        text={mediaT(`${el.id}.text`)}
                        href={el.href}
                        alt={mediaT(`${el.id}.alt`)}
                        key={el.id}
                    />
                ))}
            </div>
        </section>
    );
};

export default Media;
