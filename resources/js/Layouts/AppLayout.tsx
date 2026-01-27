import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import type { ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    title: string;
    active?: string;
}

export default function AppLayout({ children, title, active }: AppLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen bg-[#FBF9F7]">
                <Sidebar active={active} />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </>
    );
}
