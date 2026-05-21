import '../../styles/ProjectBlock.scss';
import Image from "next/image";
import Text from './Text';

export default ({
    img,
    title, 
    description,
    alt
}) => {
    return (
        <div className='ProjectBlock'>
            <Image
                src={img}
                alt={alt}
                width={1200}
                height={800}
                className="ProjectBlock_image"
                priority
            />
            <Text fw_semibold fs_xl tac>
                {title}
            </Text>
            <Text light_gray fs_m tac>
                {description}
            </Text>
        </div>
    )
}
