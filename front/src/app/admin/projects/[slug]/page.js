import AdminProjectEditClient from '@/components/admin/AdminProjectEditClient';

export default async function AdminProjectEditPage({ params }) {
    const resolvedParams = await params;

    return <AdminProjectEditClient slug={resolvedParams.slug} />;
}
