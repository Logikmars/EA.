import '../../styles/Info.scss';
import InfoBlock from '../ui/InfoBlock';
import Text from '../ui/Text';
export default () => {

    const els = [
        {
            amount: '30+',
            description: 'років у бізнесі та маркетингу'
        },
        {
            amount: '10+',
            description: 'успішно запущених бізнесів'
        },
        {
            amount: '40+',
            description: 'кампаній лояльності у 6 країнах'
        }
    ]

    const texts = ['Протягом кар’єри я постійно прагнув поєднати креативні амбіції зі структурною бізнес-реальністю. Побудова компаній - це не лише про таблиці, а про розуміння глибинних людських потреб, які рухають ринки.', 'Від запуску локальних стартапів до управління міжнародними кампаніями лояльності, що охоплюють мільйони споживачів, мій підхід незмінний: сміливе бачення, підкріплене системною реалізацією.', 'Сьогодні я зосереджений на розвитку Art Nation та допомозі бізнесам у подоланні складних викликів росту.']

    return (
        <section className='Info' id='about'>
            <div className='Info_container container'>
                <div className='Info_list'>
                    {
                        els.map(el => (
                            <InfoBlock amount={el.amount} description={el.description} key={`InfoBlock_ley_${el.amount}_${el.description}`}/>
                        ))
                    }
                </div>
                <div className='Info_text'>
                    {
                        texts.map(el => (
                            <Text white fw_medium fs_xl key={`Info_text_key_${el}`}>
                                {el}
                            </Text>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}
