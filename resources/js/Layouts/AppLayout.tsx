import { Head } from '@inertiajs/react';
import AdminSidebar from '@/Components/Sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import type { CSSProperties, ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title: string;
    active?: string;
}

export default function AppLayout({ children, title, active }: AppLayoutProps) {
    return (
        <>
            <Head title={title} />
            <SidebarProvider style={{ '--sidebar-width': '280px' } as CSSProperties}>
                <AdminSidebar active={active} />
                <SidebarInset className="bg-background">
                    <header className="flex h-12 items-center gap-2 px-4 md:hidden">
                        <SidebarTrigger />
                    </header>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
