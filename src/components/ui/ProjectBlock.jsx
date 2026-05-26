import '../../styles/ProjectBlock.scss';
import Image from 'next/image';
import Text from './Text';
import Link from 'next/link';

const ProjectBlock = ({
    id,
    img,
    title,
    description,
    alt,
    href = ''
}) => {

    const shortDescription = description.length > 100 ? `${description.slice(0, 100)}...` : description;
    const content = (
        <>
            <Image
                src={img}
                alt={alt}
                width={1200}
                height={800}
                sizes='(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='ProjectBlock_image'
            />
            <Text fw_semibold fs_xl tac>
                {title}
            </Text>
            <Text light_gray fs_m tac>
                {shortDescription}
            </Text>
        </>
    );

    if (!href || href === '#') {
        return (
            <article className='ProjectBlock' id={id}>
                {content}
            </article>
        );
    }

    return (
        <Link className='ProjectBlock' href={href} id={id}>
            {content}
        </Link>
    );
};

export default ProjectBlock;
