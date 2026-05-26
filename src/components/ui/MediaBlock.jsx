import Link from 'next/link';
import '../../styles/MediaBlock.scss';
import Image from 'next/image';
import Text from './Text';

const MediaBlock = ({
    id,
    type,
    img,
    alt,
    text,
    href,
}) => {
    const content = (
        <>
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
                    sizes='(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 25vw'
                    className='MediaBlock_image'
                />

                <Text fw_medium fs_l>
                    {text}
                </Text>
            </div>
        </>
    );

    if (!href || href === '#') {
        return (
            <article className='MediaBlock' id={id}>
                {content}
            </article>
        );
    }

    return (
        <Link className='MediaBlock' href={href} id={id}>
            {content}
        </Link>
    );
};

export default MediaBlock;
