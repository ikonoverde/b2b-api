import { router, useForm, usePage } from '@inertiajs/react';
import { Plus, ArrowUp, ArrowDown, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';
import { formatDateShort } from '@/utils/date';

type LinkType = 'product' | 'category' | 'url' | '';

interface BannerData {
    id: number;
    title: string;
    subtitle: string | null;
    image_url: string;
    link_type: LinkType | null;
    link_value: string | null;
    link_text: string | null;
    display_order: number;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
    status: 'active' | 'inactive' | 'scheduled' | 'expired';
}

interface Props extends PageProps {
    banners: BannerData[];
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    active: { label: 'Activo', bg: 'bg-green-50', text: 'text-green-700' },
    inactive: { label: 'Inactivo', bg: 'bg-gray-100', text: 'text-gray-600' },
    scheduled: { label: 'Programado', bg: 'bg-blue-50', text: 'text-blue-700' },
    expired: { label: 'Expirado', bg: 'bg-red-50', text: 'text-red-700' },
};

const linkTypeLabels: Record<string, string> = {
    product: 'Producto',
    category: 'Categoría',
    url: 'URL externa',
};

export default function Banners({ banners }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<BannerData | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const form = useForm<{
        title: string;
        subtitle: string;
        image: File | null;
        link_type: LinkType;
        link_value: string;
        link_text: string;
        is_active: boolean;
        starts_at: string;
        ends_at: string;
    }>({
        title: '',
        subtitle: '',
        image: null,
        link_type: '',
        link_value: '',
        link_text: '',
        is_active: true,
        starts_at: '',
        ends_at: '',
    });

    const openCreate = () => {
        setEditingBanner(null);
        form.reset();
        setShowModal(true);
    };

    const openEdit = (banner: BannerData) => {
        setEditingBanner(banner);
        form.setData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            image: null,
            link_type: banner.link_type || '',
            link_value: banner.link_value || '',
            link_text: banner.link_text || '',
            is_active: banner.is_active,
            starts_at: banner.starts_at ? banner.starts_at.slice(0, 16) : '',
            ends_at: banner.ends_at ? banner.ends_at.slice(0, 16) : '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', form.data.title);
        formData.append('subtitle', form.data.subtitle);
        if (form.data.image) {
            formData.append('image', form.data.image);
        }
        if (form.data.link_type) {
            formData.append('link_type', form.data.link_type);
            formData.append('link_value', form.data.link_value);
        }
        formData.append('link_text', form.data.link_text);
        formData.append('is_active', form.data.is_active ? '1' : '0');
        formData.append('starts_at', form.data.starts_at);
        formData.append('ends_at', form.data.ends_at);

        if (editingBanner) {
            formData.append('_method', 'PUT');
            router.post(`/admin/banners/${editingBanner.id}`, formData, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            router.post('/admin/banners', formData, {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/banners/${id}`, {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const toggleVisibility = (banner: BannerData) => {
        router.patch(`/admin/banners/${banner.id}/visibility`, {}, {
            preserveScroll: true,
        });
    };

    const reorder = (index: number, direction: 'up' | 'down') => {
        const items = [...banners];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= items.length) return;

        const reordered = items.map((b, i) => {
            if (i === index) return { id: b.id, display_order: swapIndex };
            if (i === swapIndex) return { id: b.id, display_order: index };
            return { id: b.id, display_order: i };
        });

        router.post('/admin/banners/reorder', { items: reordered }, {
            preserveScroll: true,
        });
    };

    const linkValuePlaceholder = (): string => {
        switch (form.data.link_type) {
            case 'product': return 'ID del producto';
            case 'category': return 'ID de categoría';
            case 'url': return 'https://ejemplo.com';
            default: return '';
        }
    };

    return (
        <AppLayout title="Banners" active="banners">
            <div className="p-8">
                <div className="max-w-5xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">
                                Banners
                            </h1>
                            <p className="text-sm text-[#666666] font-[Outfit] mt-1">
                                Administra los banners promocionales de la página principal
                            </p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-[#4A5D4A] text-white px-5 py-2.5 rounded-lg font-[Outfit] font-medium text-sm hover:bg-[#3d4e3d] transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Nuevo Banner
                        </button>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-[Outfit] text-sm">
                            {flash.success}
                        </div>
                    )}

                    {/* Banners Table */}
                    <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                        {banners.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-[#999999] font-[Outfit] text-sm">
                                    No hay banners. Crea el primero.
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#E5E5E5] bg-[#FAFAFA]">
                                        <th className="text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                            Banner
                                        </th>
                                        <th className="text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="text-left px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                            Programación
                                        </th>
                                        <th className="text-right px-4 py-3 font-[Outfit] text-xs font-medium text-[#999999] uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E5E5]">
                                    {banners.map((banner, index) => (
                                        <BannerRow
                                            key={banner.id}
                                            banner={banner}
                                            index={index}
                                            total={banners.length}
                                            onEdit={() => openEdit(banner)}
                                            onDelete={() => setDeleteConfirm(banner.id)}
                                            onToggle={() => toggleVisibility(banner)}
                                            onReorder={(dir) => reorder(index, dir)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-[#E5E5E5]">
                            <h2 className="font-[Outfit] font-semibold text-lg text-[#1A1A1A]">
                                {editingBanner ? 'Editar Banner' : 'Nuevo Banner'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
                                    required
                                />
                                {form.errors.title && (
                                    <p className="text-red-500 text-xs mt-1">{form.errors.title}</p>
                                )}
                            </div>
                            <div>
                                <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                    Subtítulo
                                </label>
                                <input
                                    type="text"
                                    value={form.data.subtitle}
                                    onChange={(e) => form.setData('subtitle', e.target.value)}
                                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
                                />
                            </div>
                            <div>
                                <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                    Imagen {editingBanner ? '' : '*'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(e) =>
                                        form.setData('image', e.target.files?.[0] || null)
                                    }
                                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
                                    required={!editingBanner}
                                />
                                {form.errors.image && (
                                    <p className="text-red-500 text-xs mt-1">{form.errors.image}</p>
                                )}
                            </div>
                            <div>
                                <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                    Tipo de enlace
                                </label>
                                <select
                                    value={form.data.link_type}
                                    onChange={(e) => {
                                        const value = e.target.value as LinkType;
                                        form.setData({
                                            ...form.data,
                                            link_type: value,
                                            link_value: value ? form.data.link_value : '',
                                        });
                                    }}
                                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
                                >
                                    <option value="">Ninguno</option>
                                    <option value="product">Producto</option>
                                    <option value="category">Categoría</option>
                                    <option value="url">URL externa</option>
                                </select>
                                {form.errors.link_type && (
                                    <p className="text-red-500 text-xs mt-1">{form.errors.link_type}</p>
                                )}
                            </div>
                            {form.data.link_type && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                            {linkTypeLabels[form.data.link_type]} *
                                        </label>
                                        <input
                                            type={form.data.link_type === 'url' ? 'url' : 'text'}
                                            placeholder={linkValuePlaceholder()}
                                            value={form.data.link_value}
                                            onChange={(e) => form.setData('link_value', e.target.value)}
                                            className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
                                            required
                                        />
                                        {form.errors.link_value && (
                                            <p className="text-red-500 text-xs mt-1">{form.errors.link_value}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                            Texto del enlace
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.link_text}
                                            onChange={(e) => form.setData('link_text', e.target.value)}
                                            className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                        Inicio
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={form.data.starts_at}
                                        onChange={(e) => form.setData('starts_at', e.target.value)}
                                        className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block font-[Outfit] text-sm font-medium text-[#1A1A1A] mb-1">
                                        Fin
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={form.data.ends_at}
                                        onChange={(e) => form.setData('ends_at', e.target.value)}
                                        className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 font-[Outfit] text-sm"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) => form.setData('is_active', e.target.checked)}
                                    className="rounded border-[#E5E5E5]"
                                />
                                <span className="font-[Outfit] text-sm text-[#1A1A1A]">
                                    Activo
                                </span>
                            </label>
                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-[Outfit] font-medium text-[#666666] hover:text-[#1A1A1A] cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="bg-[#4A5D4A] text-white px-6 py-2 rounded-lg font-[Outfit] font-medium text-sm hover:bg-[#3d4e3d] disabled:opacity-50 cursor-pointer"
                                >
                                    {form.processing
                                        ? 'Guardando...'
                                        : editingBanner
                                          ? 'Actualizar'
                                          : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6">
                        <h3 className="font-[Outfit] font-semibold text-lg text-[#1A1A1A] mb-2">
                            Eliminar Banner
                        </h3>
                        <p className="font-[Outfit] text-sm text-[#666666] mb-6">
                            ¿Estás seguro de que deseas eliminar este banner? Esta acción no se
                            puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-sm font-[Outfit] font-medium text-[#666666] hover:text-[#1A1A1A] cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg font-[Outfit] font-medium text-sm hover:bg-red-600 cursor-pointer"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

function BannerRow({
    banner,
    index,
    total,
    onEdit,
    onDelete,
    onToggle,
    onReorder,
}: {
    banner: BannerData;
    index: number;
    total: number;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: () => void;
    onReorder: (dir: 'up' | 'down') => void;
}) {
    const status = statusConfig[banner.status];

    return (
        <tr className="group">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-16 h-10 object-cover rounded-lg"
                    />
                    <div>
                        <p className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">
                            {banner.title}
                        </p>
                        {banner.link_type && (
                            <p className="font-[Outfit] text-xs text-[#999999]">
                                {linkTypeLabels[banner.link_type]}: {banner.link_value}
                            </p>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium font-[Outfit] ${status.bg} ${status.text}`}
                >
                    {status.label}
                </span>
            </td>
            <td className="px-4 py-3">
                <span className="font-[Outfit] text-xs text-[#666666]">
                    {banner.starts_at || banner.ends_at
                        ? `${formatDateShort(banner.starts_at)} → ${formatDateShort(banner.ends_at)}`
                        : 'Siempre'}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={() => onReorder('up')}
                        disabled={index === 0}
                        className="p-1.5 rounded hover:bg-[#F5F3F0] disabled:opacity-30 cursor-pointer"
                    >
                        <ArrowUp className="w-3.5 h-3.5 text-[#666666]" />
                    </button>
                    <button
                        onClick={() => onReorder('down')}
                        disabled={index === total - 1}
                        className="p-1.5 rounded hover:bg-[#F5F3F0] disabled:opacity-30 cursor-pointer"
                    >
                        <ArrowDown className="w-3.5 h-3.5 text-[#666666]" />
                    </button>
                    <button
                        onClick={onToggle}
                        className="p-1.5 rounded hover:bg-[#F5F3F0] cursor-pointer"
                        title={banner.is_active ? 'Desactivar' : 'Activar'}
                    >
                        {banner.is_active ? (
                            <Eye className="w-3.5 h-3.5 text-[#4A5D4A]" />
                        ) : (
                            <EyeOff className="w-3.5 h-3.5 text-[#999999]" />
                        )}
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-1.5 rounded hover:bg-[#F5F3F0] cursor-pointer"
                    >
                        <Pencil className="w-3.5 h-3.5 text-[#666666]" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded hover:bg-red-50 cursor-pointer"
                    >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
