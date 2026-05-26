import '../../styles/ProjectBlock.scss';
import Image from "next/image";
import Text from './Text';
import Link from 'next/link';

export default ({
    img,
    title, 
    description,
    alt,
    href = '#'
}) => {

    const shortDescription = description.length > 100 ? `${description.slice(0, 100)}...` : description;

    return (
        <Link className='ProjectBlock' href={href}>
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
                {shortDescription}
            </Text>
        </Link>
    )
}
