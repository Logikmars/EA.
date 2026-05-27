'use client';

import { Toaster } from 'react-hot-toast';

const AppToaster = () => (
    <Toaster
        position='top-right'
        toastOptions={{
            duration: 4000,
            style: {
                background: '#101114',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.28)',
            },
            success: {
                iconTheme: {
                    primary: '#0a66ff',
                    secondary: '#ffffff',
                },
            },
            error: {
                iconTheme: {
                    primary: '#ff7e7e',
                    secondary: '#ffffff',
                },
            },
        }}
    />
);

export default AppToaster;
