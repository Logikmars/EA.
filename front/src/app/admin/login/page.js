import AdminLoginClient from '@/components/admin/AdminLoginClient';
import { normalizeAdminCallbackUrl } from '@/lib/adminNavigation';

export default async function AdminLoginPage({ searchParams }) {
    const params = await searchParams;
    const callbackUrl = normalizeAdminCallbackUrl(params?.callbackUrl);

    return (
        <AdminLoginClient callbackUrl={callbackUrl} />
    );
}
