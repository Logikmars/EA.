'use client';

import { useEffect, useState, startTransition } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import adminStore from '@/stores/AdminStore';
import { normalizeAdminCallbackUrl } from '@/lib/adminNavigation';

const AdminLoginClient = observer(({
    callbackUrl = '/admin',
}) => {
    const router = useRouter();
    const safeCallbackUrl = normalizeAdminCallbackUrl(callbackUrl);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            const session = await adminStore.fetchSession();

            if (isMounted && session) {
                startTransition(() => {
                    router.replace(safeCallbackUrl);
                });
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [router, safeCallbackUrl]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const result = adminStore.pendingTwoFactor
            ? await adminStore.verifyTwoFactor(otp)
            : await adminStore.login({
                email,
                password,
                callbackUrl: safeCallbackUrl,
            });

        if (result.ok) {
            if (adminStore.pendingTwoFactor) {
                return;
            }

            startTransition(() => {
                router.push(safeCallbackUrl);
            });
        }
    };

    const handleBack = () => {
        adminStore.resetTwoFactor();
        setOtp('');
        setPassword('');
    };

    const isTwoFactorStep = Boolean(adminStore.pendingTwoFactor);

    return (
        <main className='AdminShell'>
            <section className='AdminLoginCard'>
                <div className='AdminEyebrow'>Admin</div>
                <h1>{isTwoFactorStep ? 'Two-factor verification' : 'Sign in'}</h1>
                <p>
                    {isTwoFactorStep
                        ? 'Enter the 6-digit code from Google Authenticator to finish signing in.'
                        : 'Use your admin email and password to continue.'}
                </p>
                {adminStore.error ? <div className='AdminAlert AdminAlert__error'>{adminStore.error}</div> : null}
                <form className='AdminForm' onSubmit={handleSubmit}>
                    {isTwoFactorStep ? (
                        <label className='AdminField'>
                            <span>Authentication code</span>
                            <input
                                autoComplete='one-time-code'
                                inputMode='numeric'
                                maxLength={6}
                                name='otp'
                                onChange={(event) => setOtp(event.target.value.replace(/\D+/g, ''))}
                                pattern='[0-9]{6}'
                                placeholder='123456'
                                required
                                type='text'
                                value={otp}
                            />
                        </label>
                    ) : (
                        <>
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
                        </>
                    )}
                    <button className='AdminButton' disabled={adminStore.isSubmitting} type='submit'>
                        {adminStore.isSubmitting
                            ? (isTwoFactorStep ? 'Verifying...' : 'Signing in...')
                            : (isTwoFactorStep ? 'Verify code' : 'Continue')}
                    </button>
                    {isTwoFactorStep ? (
                        <button className='AdminButton AdminButton__secondary' onClick={handleBack} type='button'>
                            Back
                        </button>
                    ) : null}
                </form>
            </section>
        </main>
    );
});

export default AdminLoginClient;
