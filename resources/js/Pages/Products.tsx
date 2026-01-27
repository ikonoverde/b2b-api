import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    Download,
    Plus,
    MoreHorizontal,
    Package,
} from 'lucide-react';
import type { PageProps, Product } from '@/types';

interface ProductsProps extends PageProps {
    products: Product[];
}

type TabFilter = 'all' | 'active' | 'inactive' | 'low_stock';

const tabs: { id: TabFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'active', label: 'Activos' },
    { id: 'inactive', label: 'Inactivos' },
    { id: 'low_stock', label: 'Stock bajo' },
];

export default function Products({ products }: ProductsProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState<TabFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter((product) => {
        const matchesTab =
            activeTab === 'all' || product.status === activeTab;
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <AppLayout title="Productos" active="products">
            <div className="flex flex-col gap-6 p-10 pr-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]">
                            Productos
                        </h1>
                        <p className="text-sm text-[#666666] font-[Outfit]">
                            Gestiona tu catálogo de productos
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="flex items-center gap-3 w-60 h-11 px-4 bg-white rounded-lg border border-[#E5E5E5]">
                            <Search className="w-[18px] h-[18px] text-[#999999]" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] bg-transparent border-none outline-none"
                            />
                        </div>

                        {/* Bell */}
                        <button className="w-11 h-11 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Bell className="w-5 h-5 text-[#666666]" />
                        </button>

                        {/* Settings */}
                        <button className="w-11 h-11 bg-white rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Settings className="w-5 h-5 text-[#666666]" />
                        </button>

                        {/* User Profile */}
                        <button className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 bg-white rounded-full border border-[#E5E5E5] hover:bg-gray-50 transition-colors">
                            <div className="w-9 h-9 bg-[#4A5D4A] rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-white font-[Outfit]">
                                    {user?.initials?.[0] || 'A'}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                {user?.name?.split(' ')[0] || 'Admin'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#999999]" />
                        </button>
                    </div>
                </div>

                {/* Tabs and Actions */}
                <div className="flex items-center justify-between">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-lg p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-md text-[13px] font-medium font-[Outfit] transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-[#4A5D4A] text-white'
                                        : 'text-[#666666] hover:bg-white/50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-lg text-[13px] font-medium text-[#666666] font-[Outfit] hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                            Exportar
                        </button>
                        <Link
                            href="/admin/products/create"
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#4A5D4A] rounded-lg text-[13px] font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar producto
                        </Link>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 px-6 py-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
                        <span className="text-[13px] font-medium text-[#666666] font-[Outfit]">
                            Producto
                        </span>
                        <span className="text-[13px] font-medium text-[#666666] font-[Outfit]">
                            Categoría
                        </span>
                        <span className="text-[13px] font-medium text-[#666666] font-[Outfit]">
                            Precio
                        </span>
                        <span className="text-[13px] font-medium text-[#666666] font-[Outfit]">
                            Stock
                        </span>
                        <span className="text-[13px] font-medium text-[#666666] font-[Outfit]">
                            Estado
                        </span>
                        <span className="text-[13px] font-medium text-[#666666] font-[Outfit]">
                            Acción
                        </span>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-[#E5E5E5]">
                        {filteredProducts.map((product) => (
                            <ProductRow key={product.id} product={product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Package className="w-12 h-12 text-[#999999]" />
                            <span className="text-sm text-[#999999] font-[Outfit]">
                                No se encontraron productos
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function ProductRow({ product }: { product: Product }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const statusConfig = {
        active: {
            label: 'Activo',
            bg: '#E8F5E9',
            color: '#4CAF50',
        },
        inactive: {
            label: 'Inactivo',
            bg: '#F5F5F5',
            color: '#999999',
        },
        low_stock: {
            label: 'Stock bajo',
            bg: '#FFF3E0',
            color: '#FF9800',
        },
    };

    const status = statusConfig[product.status];

    return (
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] gap-4 px-6 py-4 items-center hover:bg-[#FAFAFA] transition-colors">
            {/* Product Info */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <Package className="w-5 h-5 text-[#999999]" />
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                        {product.name}
                    </span>
                    <span className="text-xs text-[#999999] font-[Outfit]">
                        {product.sku}
                    </span>
                </div>
            </div>

            {/* Category */}
            <span className="text-sm text-[#666666] font-[Outfit]">
                {product.category}
            </span>

            {/* Price */}
            <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                ${product.price.toFixed(2)}
            </span>

            {/* Stock */}
            <span className="text-sm text-[#666666] font-[Outfit]">
                {product.stock.toLocaleString()}
            </span>

            {/* Status */}
            <div>
                <span
                    className="inline-flex px-3 py-1 rounded-full text-xs font-medium font-[Outfit]"
                    style={{ backgroundColor: status.bg, color: status.color }}
                >
                    {status.label}
                </span>
            </div>

            {/* Action */}
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F5F5] transition-colors"
                >
                    <MoreHorizontal className="w-5 h-5 text-[#999999]" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-10 min-w-[120px]">
                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="block px-4 py-2.5 text-sm text-[#1A1A1A] font-[Outfit] hover:bg-[#F5F3F0] transition-colors"
                        >
                            Editar
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
