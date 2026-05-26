import MediaBlock from '@/components/ui/MediaBlock';
import Text from '@/components/ui/Text';
import { buildMetadata } from '@/lib/seo';
import MediaStore from '@/stores/MediaStore';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../../../styles/MediaPage.scss';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations('SEO');

    return buildMetadata({
        locale,
        title: t('mediaTitle'),
        description: t('mediaDescription'),
        pathname: '/media',
    });
}

const MediaPage = async ({ params }) => {
    const { locale } = await params;

    setRequestLocale(locale);

    const t = await getTranslations('MediaPage');
    const mediaT = await getTranslations('MediaItems');

    return (
        <div className='MediaPage'>
            <Text h1 fw_bold fs_2xl>
                {t('title')}
            </Text>
            <div className='MediaPage_list'>
                {MediaStore.medias.map((el) => (
                    <MediaBlock
                        key={el.id}
                        type={mediaT(`${el.id}.type`)}
                        img={el.img}
                        text={mediaT(`${el.id}.text`)}
                        href={el.href}
                        alt={mediaT(`${el.id}.alt`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MediaPage;
