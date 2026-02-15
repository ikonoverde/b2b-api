import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
} from 'lucide-react';
import type { PageProps } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

interface UsersData {
    data: User[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props extends PageProps {
    users: UsersData;
}

const roleLabels: Record<string, string> = {
    customer: 'Cliente',
    admin: 'Administrador',
    super_admin: 'Super Admin',
};

export default function UsersIndex() {
    const { users } = usePage<Props>().props;

    const getSortIcon = (field: string) => {
        const currentSortBy = new URLSearchParams(window.location.search).get('sort_by') || 'created_at';
        const currentSortOrder = new URLSearchParams(window.location.search).get('sort_order') || 'desc';
        
        if (currentSortBy !== field) {
            return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
        }
        
        return currentSortOrder === 'asc' 
            ? <ArrowUpDown className="w-4 h-4 text-[#1A1A1A]" />
            : <ArrowUpDown className="w-4 h-4 text-[#1A1A1A] rotate-180" />;
    };

    const handleSort = (field: string) => {
        const params = new URLSearchParams(window.location.search);
        const currentSortBy = params.get('sort_by') || 'created_at';
        const currentSortOrder = params.get('sort_order') || 'desc';
        
        if (currentSortBy === field) {
            params.set('sort_order', currentSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            params.set('sort_by', field);
            params.set('sort_order', 'desc');
        }
        
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout title="Usuarios" active="users">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]">
                            Usuarios
                        </h1>
                        <p className="text-sm text-[#666666] font-[Outfit]">
                            Gestiona los usuarios del sistema
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E5E5]">
                                <th 
                                    className="text-left px-6 py-4 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#666666]">Nombre</span>
                                        {getSortIcon('name')}
                                    </div>
                                </th>
                                <th 
                                    className="text-left px-6 py-4 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#666666]">Email</span>
                                        {getSortIcon('email')}
                                    </div>
                                </th>
                                <th 
                                    className="text-left px-6 py-4 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('role')}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#666666]">Rol</span>
                                        {getSortIcon('role')}
                                    </div>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-[#666666]">Estado</span>
                                </th>
                                <th 
                                    className="text-left px-6 py-4 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('created_at')}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#666666]">Registrado</span>
                                        {getSortIcon('created_at')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr 
                                    key={user.id} 
                                    className="border-b border-[#E5E5E5] hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#1A1A1A]">{user.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#1A1A1A]">{user.email}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {roleLabels[user.role] || user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.is_active 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[#666666]">
                                            {formatDate(user.created_at)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-[#666666]">No hay usuarios registrados</p>
                        </div>
                    )}

                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
                            <span className="text-sm text-[#666666]">
                                Mostrando {users.from} a {users.to} de {users.total} usuarios
                            </span>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`?page=${users.current_page - 1}`}
                                    className={`p-2 rounded-lg border border-[#E5E5E5] ${
                                        users.current_page === 1 
                                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                            : 'hover:bg-gray-50'
                                    }`}
                                    preserveScroll
                                >
                                    <ChevronLeft className="w-4 h-4 text-[#666666]" />
                                </Link>
                                <span className="text-sm text-[#1A1A1A]">
                                    {users.current_page} / {users.last_page}
                                </span>
                                <Link
                                    href={`?page=${users.current_page + 1}`}
                                    className={`p-2 rounded-lg border border-[#E5E5E5] ${
                                        users.current_page === users.last_page
                                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                            : 'hover:bg-gray-50'
                                    }`}
                                    preserveScroll
                                >
                                    <ChevronRight className="w-4 h-4 text-[#666666]" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
