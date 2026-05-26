import '../../styles/Hero.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Text from '../ui/Text';
import SocialBar from '../ui/SocialBar';
import Btn from '../ui/Btn';
import RunningLine from '../ui/RunningLine';

const Hero = () => {
    const t = useTranslations('Hero');

    return (
        <section className='Hero container' id='top'>
            <div className='Hero_info'>
                <div className='Hero_info_text'>
                    <Text h1 fs_2xl fw_bold>
                        {t('name')}
                    </Text>
                    <Text fs_xl light_gray fw_medium>
                        {t('subtitle')}
                    </Text>
                    <Text fs_m>
                        {t('description')}
                    </Text>
                    <div className='Hero_info_social'>
                        <Btn color_blue fw_medium>
                            {t('invite')}
                        </Btn>
                        <Btn color_transparent text_black fw_medium>
                            {t('consultation')}
                        </Btn>
                    </div>
                    <SocialBar />
                </div>
                <div className='Hero_info_img'>
                    <Image
                        src='/imgs/EduardAkhramovych.webp'
                        alt={t('imageAlt')}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1400px) 40vw, 550px'
                        priority
                    />
                </div>
            </div>
            <div className='Hero_list'>
                <RunningLine />
            </div>
        </section>
    );
};

export default Hero;
