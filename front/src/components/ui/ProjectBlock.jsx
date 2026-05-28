import '../../styles/ProjectBlock.scss';
import Image from 'next/image';
import Text from './Text';
import Link from 'next/link';

function isExternalLink(href) {
    return href.startsWith('http://') || href.startsWith('https://');
}

function shouldUseUnoptimizedImage(src) {
    return typeof src === 'string' && (
        src.startsWith('http://localhost:5000/uploads/')
        || src.startsWith('http://127.0.0.1:5000/uploads/')
    );
}

function renderProjectImage(src, alt) {
    if (shouldUseUnoptimizedImage(src)) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} className='ProjectBlock_image' loading='lazy' />;
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            sizes='(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='ProjectBlock_image'
        />
    );
}

const ProjectBlock = ({
    id,
    img,
    title,
    description,
    alt,
    href = ''
}) => {
    const normalizedImage = img || '/imgs/projects/1.png';
    const normalizedAlt = alt || title || 'Project image';
    const normalizedDescription = typeof description === 'string' ? description.trim() : '';
    const shortDescription = normalizedDescription.length > 100
        ? `${normalizedDescription.slice(0, 100)}...`
        : normalizedDescription;
    const content = (
        <>
            <div className='ProjectBlock_media'>
                {renderProjectImage(normalizedImage, normalizedAlt)}
            </div>
            <Text fw_semibold fs_xl tac>
                {title}
            </Text>
            {shortDescription ? (
                <Text light_gray fs_m tac>
                    {shortDescription}
                </Text>
            ) : null}
        </>
    );

    if (!href || href === '#') {
        return (
            <article className='ProjectBlock' id={id}>
                {content}
            </article>
        );
    }

    if (isExternalLink(href)) {
        return (
            <a className='ProjectBlock' href={href} id={id} rel='noopener noreferrer' target='_blank'>
                {content}
            </a>
        );
    }

    return (
        <Link className='ProjectBlock' href={href} id={id}>
            {content}
        </Link>
    );
};

export default ProjectBlock;
