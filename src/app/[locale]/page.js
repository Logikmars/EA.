import Cooperation from '@/components/sections/Cooperation';
import Hero from '@/components/sections/Hero';
import Info from '@/components/sections/Info';
import MainForm from '@/components/sections/MainForm';
import Media from '@/components/sections/Media';
import Projects from '@/components/sections/Projects';
import { buildMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations('SEO');

    return buildMetadata({
        locale,
        title: t('homeTitle'),
        description: t('homeDescription'),
    });
}

const HomePage = async ({ params }) => {
    const { locale } = await params;

    setRequestLocale(locale);

    return (
        <div className='page'>
            <Hero />
            <Info />
            <Projects />
            <Cooperation />
            <Media />
            <MainForm />
        </div>
    );
};

export default HomePage;
