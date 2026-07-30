import '../../styles/Hero.scss';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import Text from '../ui/Text';
import SocialBar from '../ui/SocialBar';
import Btn from '../ui/Btn';

const RunningLine = dynamic(() => import('../ui/RunningLine'), {
    loading: () => null,
});

const HeroMotion = dynamic(() => import('./HeroMotion'), {
    loading: () => null,
});

const Hero = async () => {
    const t = await getTranslations('Hero');

    return (
        <section className='Hero container' id='top'>
            <HeroMotion />
            <div className='Hero_info'>
                <div className='Hero_info_text'>
                    <Text h1 fs_2xl fw_bold className='Hero_animate_text'>
                        {t('name')}
                    </Text>
                    <Text fs_xl light_gray fw_medium className='Hero_animate_text'>
                        {t('subtitle')}
                    </Text>
                    <Text fs_m className='Hero_animate_text'>
                        {t('description')}
                    </Text>
                    <div className='Hero_info_social'>
                        <Btn color_blue fw_medium className='Hero_animate_button' href='#contact'>
                            {t('consultation')}
                        </Btn>
                    </div>
                    <div className='Hero_animate_social'>
                        <SocialBar />
                    </div>
                </div>
                <div className='Hero_info_img Hero_animate_image'>
                    <Image
                        src='/imgs/EduardAkhramovych.webp'
                        alt={t('imageAlt')}
                        fill
                        sizes='(max-width: 900px) 92vw, (max-width: 1400px) 40vw, 550px'
                        priority
                    />
                </div>
            </div>
            <div className='Hero_list Hero_animate_line'>
                <RunningLine />
            </div>
        </section>
    );
};

export default Hero;
