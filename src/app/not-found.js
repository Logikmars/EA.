import Link from 'next/link';
import Text from '@/components/ui/Text';
import '../styles/NotFound.scss';

export default function RootNotFound() {
    return (
        <section className='NotFound'>
            <div className='NotFound_card'>
                <Text fs_xs fw_semibold className='NotFound_eyebrow'>
                    404
                </Text>
                <Text h1 fs_2xl fw_bold className='NotFound_title'>
                    Page not found
                </Text>
                <Text fs_l className='NotFound_description'>
                    This route does not exist. Choose the preferred language version and continue from the main site.
                </Text>
                <div className='NotFound_links'>
                    <Link className='NotFound_link' href='/ua'>Ukrainian version</Link>
                    <Link className='NotFound_link' href='/en'>English version</Link>
                </div>
            </div>
        </section>
    );
}
