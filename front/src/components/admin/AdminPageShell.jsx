'use client';

import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { startTransition, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import adminStore from '@/stores/AdminStore';

const navigationItems = [
    { href: '/admin/projects', label: 'Projects list' },
    { href: '/admin/projects/new', label: 'Add project' },
    { href: '/admin/media', label: 'Media list' },
    { href: '/admin/media/new', label: 'Add media' },
];

const AdminPageShell = observer(({
    title,
    description,
    loadContent = false,
    children,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            setIsReady(false);

            const session = await adminStore.fetchSession();

            if (!isMounted) {
                return;
            }

            if (!session) {
                startTransition(() => {
                    router.replace(`/admin/login?callbackUrl=${encodeURIComponent(pathname || '/admin')}`);
                });

                return;
            }

            if (loadContent) {
                await adminStore.loadContent();

                if (!isMounted) {
                    return;
                }
            }

            setIsReady(true);
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [loadContent, pathname, router]);

    const handleLogout = async () => {
        await adminStore.logout();
        startTransition(() => {
            router.replace('/admin/login');
        });
    };

    if (adminStore.isCheckingSession || (loadContent && !isReady)) {
        return (
            <main className='AdminShell'>
                <section className='AdminLoginCard'>
                    <div className='AdminEyebrow'>Admin Access</div>
                    <h1>{loadContent ? 'Loading content...' : 'Checking session...'}</h1>
                </section>
            </main>
        );
    }

    return (
        <main className='AdminShell'>
            <section className='AdminPanel'>
                <div className='AdminTopbar'>
                    <div>
                        <div className='AdminEyebrow'>Art Nation Admin</div>
                        <h1>{title}</h1>
                        <p>{description}</p>
                    </div>
                    <div className='AdminTopbarActions'>
                        <button className='AdminButton AdminButton__secondary' onClick={handleLogout} type='button'>
                            Sign out
                        </button>
                    </div>
                </div>

                <nav className='AdminNav'>
                    {navigationItems.map((item) => (
                        <Link
                            className={`AdminNavLink${pathname === item.href ? ' AdminNavLink__active' : ''}`}
                            href={item.href}
                            key={item.href}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {adminStore.error ? <div className='AdminAlert AdminAlert__error'>{adminStore.error}</div> : null}
                {adminStore.success ? <div className='AdminAlert AdminAlert__success'>{adminStore.success}</div> : null}

                {children}
            </section>
        </main>
    );
});

export default AdminPageShell;
