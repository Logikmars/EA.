import Link from 'next/link';
import '../../styles/MediaBlock.scss';
import Image from 'next/image';
import Text from './Text';
export default ({
    type,
    img,
    alt,
    text,
    href
}) => {
    return (
        <Link className='MediaBlock' href={href}>
            <div className='MediaBlock_decor free_img'> 
                <div className='MediaBlock_decor_type'>
                    <Text fs_2xs fw_semibold>
                        {type.toUpperCase()}
                    </Text>
                </div>
            </div>
            <div className='MediaBlock_content'>
                <Image
                    src={img}
                    alt={alt}
                    width={1200}
                    height={800}
                    className="MediaBlock_image"
                    priority
                />

                <Text fw_medium fs_l>
                    {text}
                </Text>
            </div>
        </Link>
    )
}