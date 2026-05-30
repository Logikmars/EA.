import '../../styles/Admin.scss';

export const metadata = {
    robots: {
        index: false,
        follow: false,
        noarchive: true,
        nocache: true,
        nosnippet: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            noarchive: true,
            nosnippet: true,
        },
    },
};

export default function AdminLayout({ children }) {
    return children;
}
