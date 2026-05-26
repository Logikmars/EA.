import localFont from 'next/font/local';

export const inter = localFont({
    src: '../../public/fonts/Inter.ttf',
    display: 'swap',
    variable: '--font-inter',
    preload: true,
    fallback: ['Arial', 'sans-serif'],
});
