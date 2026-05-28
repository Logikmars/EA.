import AdminLoginClient from '@/components/admin/AdminLoginClient';
import '../../../styles/Admin.scss';

export default async function AdminLoginPage({ searchParams }) {
    const params = await searchParams;
    const callbackUrl = params?.callbackUrl || '/admin';

    return (
        <AdminLoginClient callbackUrl={callbackUrl} />
    );
}
