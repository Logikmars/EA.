import { Inter } from 'next/font/google';

export const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
    variable: '--font-inter',
    preload: true,
    fallback: ['Arial', 'sans-serif'],
});
