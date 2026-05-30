import Link from 'next/link';
import '../../styles/MediaBlock.scss';
import Image from 'next/image';
import Text from './Text';
import { isManagedUploadUrl, resolveImageUrl } from '@/lib/media';

function isExternalLink(href) {
    return href.startsWith('http://') || href.startsWith('https://');
}

function shouldUseUnoptimizedImage(src) {
    return isManagedUploadUrl(src);
}

function renderMediaImage(src, alt) {
    if (shouldUseUnoptimizedImage(src)) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} className='MediaBlock_image' loading='lazy' />;
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes='(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 25vw'
            className='MediaBlock_image'
        />
    );
}

const MediaBlock = ({
    id,
    type,
    img,
    alt,
    text,
    description,
    href,
}) => {
    const normalizedImage = img || '/imgs/projects/1.png';
    const resolvedImage = resolveImageUrl(normalizedImage);
    const normalizedAlt = alt || text || 'Media image';
    const normalizedType = typeof type === 'string' ? type.trim() : '';
    const normalizedDescription = typeof description === 'string' ? description.trim() : '';
    const shortDescription = normalizedDescription.length > 100
        ? `${normalizedDescription.slice(0, 100)}...`
        : normalizedDescription;
    const content = (
        <>
            <div className='MediaBlock_decor free_img'>
                {normalizedType ? (
                    <div className='MediaBlock_decor_type'>
                        <Text fs_2xs fw_semibold>
                            {normalizedType.toUpperCase()}
                        </Text>
                    </div>
                ) : null}
            </div>
            <div className='MediaBlock_content'>
                <div className='MediaBlock_media'>
                    {renderMediaImage(resolvedImage, normalizedAlt)}
                </div>

                <Text fw_medium fs_l>
                    {text}
                </Text>
                {shortDescription ? (
                    <Text light_gray fs_m>
                        {shortDescription}
                    </Text>
                ) : null}
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

    if (isExternalLink(href)) {
        return (
            <a className='MediaBlock' href={href} id={id} rel='noopener noreferrer' target='_blank'>
                {content}
            </a>
        );
    }

    return (
        <Link className='MediaBlock' href={href} id={id}>
            {content}
        </Link>
    );
};

export default MediaBlock;
