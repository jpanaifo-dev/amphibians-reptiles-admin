import { redirect } from 'next/navigation';
import { getUserAuth } from '@/lib/session';
import { AdminLayoutWrapper } from '@/components/admin/admin-layout-wrapper';
import { APP_ROUTES } from '@/config/app-routes';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUserAuth();

    if (!user) {
        redirect(APP_ROUTES.AUTH.LOGIN);
    }

    // Transform session user to the format expected by the sidebar
    const userData = {
        name: user.person ? `${user.person.firstname} ${user.person.lastname}` : user.username,
        email: user.person?.email || 'admin@iiap.gob.pe',
        avatar: user.person?.image || '/avatars/shadcn.jpg',
    };

    return (
        <AdminLayoutWrapper user={userData}>
            {children}
        </AdminLayoutWrapper>
    );
}
