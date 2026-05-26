import MainForm from '@/components/sections/MainForm';
import { buildMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import '../../../styles/Invite.scss';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations('SEO');

    return buildMetadata({
        locale,
        title: t('inviteTitle'),
        description: t('inviteDescription'),
        pathname: '/invite',
    });
}

const InvitePage = async ({ params }) => {
    const { locale } = await params;

    setRequestLocale(locale);

    return <MainForm />;
};

export default InvitePage;
