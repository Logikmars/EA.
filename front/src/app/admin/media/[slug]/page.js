import AdminMediaEditClient from '@/components/admin/AdminMediaEditClient';

export default async function AdminMediaEditPage({ params }) {
    const resolvedParams = await params;

    return <AdminMediaEditClient slug={resolvedParams.slug} />;
}
