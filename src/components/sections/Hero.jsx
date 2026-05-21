import '../../styles/Hero.scss';
import Image from "next/image";
import Text from '../ui/Text';
import SocialBar from '../ui/SocialBar';
import Btn from '../ui/Btn';
import RunningLine from '../ui/RunningLine';

export default () => {

    return (
        <section className='Hero container'>
            <div className='Hero_info'>
                <div className='Hero_info_text'>
                    <Text h1 fs_2xl fw_bold>
                        Едуард Ахрамович
                    </Text>
                    <Text fs_xl light_gray fw_medium>
                        Підприємець з досвідом 30+ років, <br /> Засновник & ex-CEO Art Nation.
                    </Text>
                    <Text fs_m >
                        Створюю продукти-блокбастери та програми лояльності по всьому світу.  Поєдную бізнес-стратегію з креативним баченням, щоб трансформувати ринки.
                    </Text>
                    <div className='Hero_info_social'>
                        <Btn color_blue fw_medium>
                            Запросити Едуарда
                        </Btn>
                        <Btn color_transparent text_black fw_medium>
                            Отримати консультацію
                        </Btn>
                    </div>
                    <SocialBar />
                </div>
                <div className='Hero_info_img'>
                    <Image
                        src="/imgs/EduardAkhramovych.webp"
                        alt="Hero image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1400px) 40vw, 550px"
                        priority
                    />
                </div>
            </div>
            <div className='Hero_list'>
                <RunningLine />
            </div>
        </section>
    )
}
