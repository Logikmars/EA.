import '../../styles/InfoBlock.scss';
import Text from './Text';

const InfoBlock = ({
    amount,
    description
}) => {
    return (
        <div className='InfoBlock'>
            <Text white fs_2xl fw_semibold>
                {amount}
            </Text>
            <Text white_60 fs_m>
                {description.toLowerCase()}
            </Text>
        </div>
    )
};

export default InfoBlock;
