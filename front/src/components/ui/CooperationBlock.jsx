import Image from 'next/image';
import '../../styles/CooperationBlock.scss';
import Btn from './Btn';

const CooperationBlock = ({
    img,
    title,
    description,
    priceLabel,
    price,
    btnText,
    href,
    outlined = false,
}) => {
    return (
        <article className='CooperationBlock'>
            <div className='CooperationBlock_content'>
                <div className='CooperationBlock_img'>
                    <Image
                        src={img}
                        alt=''
                        width={24}
                        height={24}
                        sizes='24px'
                        className='CooperationBlock_img_image'
                    />
                </div>
                <div className='CooperationBlock_text'>
                    <h3>{title}</h3>
                    {description.split(/\n\s*\n/).map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
            <div className='CooperationBlock_footer'>
                <div className='CooperationBlock_price'>
                    <span>{priceLabel}</span>
                    <strong>{price}</strong>
                </div>
                <Btn
                    href={href}
                    w100
                    fw_medium
                    color_blue={!outlined}
                    color_transparent={outlined}
                    text_white={!outlined}
                    text_black={outlined}
                    className='CooperationBlock_button'
                >
                    <span>{btnText}</span>
                    <svg viewBox='0 0 20 20' aria-hidden='true'>
                        <path d='M4 10h11M11 6l4 4-4 4' />
                    </svg>
                </Btn>
            </div>
        </article>
    );
};

export default CooperationBlock;
