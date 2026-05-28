'use client';

import { useEffect, useState, startTransition } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import adminStore from '@/stores/AdminStore';

const AdminLoginClient = observer(({
    callbackUrl = '/admin',
}) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            const session = await adminStore.fetchSession();

            if (isMounted && session) {
                startTransition(() => {
                    router.replace('/admin');
                });
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [router]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const result = await adminStore.login({
            email,
            password,
            callbackUrl,
        });

        if (result.ok) {
            startTransition(() => {
                router.push('/admin');
            });
        }
    };

    return (
        <main className='AdminShell'>
            <section className='AdminLoginCard'>
                <div className='AdminEyebrow'>Admin Access</div>
                <h1>Sign in</h1>
                <p>Authorization now goes through the separate Express backend in `back`.</p>
                {adminStore.error ? <div className='AdminAlert AdminAlert__error'>{adminStore.error}</div> : null}
                <form className='AdminForm' onSubmit={handleSubmit}>
                    <label className='AdminField'>
                        <span>Email</span>
                        <input
                            autoComplete='email'
                            name='email'
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            type='email'
                            value={email}
                        />
                    </label>
                    <label className='AdminField'>
                        <span>Password</span>
                        <input
                            autoComplete='current-password'
                            name='password'
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            type='password'
                            value={password}
                        />
                    </label>
                    <button className='AdminButton' disabled={adminStore.isSubmitting} type='submit'>
                        {adminStore.isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </section>
        </main>
    );
});

export default AdminLoginClient;
