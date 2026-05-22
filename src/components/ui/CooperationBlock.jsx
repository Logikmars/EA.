import Image from 'next/image';
import '../../styles/CooperationBlock.scss';
import Text from './Text';
import Btn from './Btn';
export default ({
    img,
    alt,
    title,
    description,
    btnText,
    href
}) => {
    return (
        <div className='CooperationBlock'>
            <div className='CooperationBlock_img'>
                <Image
                    src={img}
                    alt={alt}
                    width={1200}
                    height={800}
                    className="CooperationBlock_img_image"
                />
            </div>
            <div className='CooperationBlock_text'>
                <Text fw_semibold fs_xl>
                    {title}
                </Text>
                <Text light_gray fs_m>
                    {description}
                </Text>
            </div>
            <Btn href={href} text_black w100 color_transparent fw_medium>
                {btnText}
            </Btn>
        </div>
    )
}