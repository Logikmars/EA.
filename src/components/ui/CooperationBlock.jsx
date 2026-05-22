import Image from 'next/image';
import '../../styles/CooperationBlock.scss';
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
        </div>
    )
}