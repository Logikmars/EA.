import '../../styles/InfoBlock.scss';
import Text from './Text';
export default ({
    amount,
    description
}) => {
    return (
        <div className='InfoBlock'>
            <Text white fs_2xl fw_semibold h3>
                {amount}
            </Text>
            <Text white_60 fs_m>
                {description.toLowerCase()}
            </Text>
        </div>
    )
}