import { FormEvent, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Save, ImagePlus, ChevronDown } from 'lucide-react';
import type { PageProps } from '@/types';

interface ProductForm {
    name: string;
    sku: string;
    category: string;
    description: string;
    price: string;
    cost: string;
    stock: string;
    min_stock: string;
    is_active: boolean;
    is_featured: boolean;
}

interface ProductData extends ProductForm {
    id: number;
}

interface EditProductProps extends PageProps {
    product: ProductData;
    categories: string[];
}

export default function Edit({ product, categories }: EditProductProps) {
    const [categoryOpen, setCategoryOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm<ProductForm>({
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        min_stock: product.min_stock,
        is_active: product.is_active,
        is_featured: product.is_featured,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`);
    };

    return (
        <AppLayout title="Editar Producto" active="products">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-10 pr-12">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]">
                            Editar Producto
                        </h1>
                        <div className="flex items-center gap-2 text-sm font-[Outfit]">
                            <Link
                                href="/admin/products"
                                className="text-[#999999] hover:text-[#666666] transition-colors"
                            >
                                Productos
                            </Link>
                            <span className="text-[#999999]">/</span>
                            <span className="text-[#666666]">Editar Producto</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/products"
                            className="flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50"
                        >
                            <Save className="w-[18px] h-[18px]" />
                            Actualizar Producto
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex gap-8">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Basic Info Card */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Información Básica
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                {/* Name Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                        Nombre del Producto
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Camiseta Básica Algodón"
                                        className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                                    />
                                    {errors.name && (
                                        <span className="text-xs text-red-500 font-[Outfit]">{errors.name}</span>
                                    )}
                                </div>

                                {/* SKU and Category Row */}
                                <div className="flex gap-5">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            SKU / Código
                                        </label>
                                        <input
                                            type="text"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            placeholder="Ej: CAM-BAS-001"
                                            className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                                        />
                                        {errors.sku && (
                                            <span className="text-xs text-red-500 font-[Outfit]">{errors.sku}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col gap-2 relative">
                                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            Categoría
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setCategoryOpen(!categoryOpen)}
                                            className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors flex items-center justify-between"
                                        >
                                            <span className={data.category ? 'text-[#1A1A1A]' : 'text-[#999999]'}>
                                                {data.category || 'Seleccionar categoría'}
                                            </span>
                                            <ChevronDown className="w-[18px] h-[18px] text-[#999999]" />
                                        </button>
                                        {categoryOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-10 max-h-48 overflow-y-auto">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        type="button"
                                                        onClick={() => {
                                                            setData('category', cat);
                                                            setCategoryOpen(false);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-[#1A1A1A] font-[Outfit] hover:bg-[#F5F3F0] transition-colors"
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {errors.category && (
                                            <span className="text-xs text-red-500 font-[Outfit]">{errors.category}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Description Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe las características del producto..."
                                        rows={4}
                                        className="p-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors resize-none leading-relaxed"
                                    />
                                    {errors.description && (
                                        <span className="text-xs text-red-500 font-[Outfit]">{errors.description}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Precios e Inventario
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                {/* Price Row */}
                                <div className="flex gap-5">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            Precio de Venta
                                        </label>
                                        <div className="flex h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                                            <div className="flex items-center px-3 bg-[#F5F3F0] border-r border-[#E5E5E5]">
                                                <span className="text-sm text-[#666666] font-[Outfit]">$</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                placeholder="0.00"
                                                className="flex-1 px-3 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                                            />
                                        </div>
                                        {errors.price && (
                                            <span className="text-xs text-red-500 font-[Outfit]">{errors.price}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            Precio de Costo
                                        </label>
                                        <div className="flex h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                                            <div className="flex items-center px-3 bg-[#F5F3F0] border-r border-[#E5E5E5]">
                                                <span className="text-sm text-[#666666] font-[Outfit]">$</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={data.cost}
                                                onChange={(e) => setData('cost', e.target.value)}
                                                placeholder="0.00"
                                                className="flex-1 px-3 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                                            />
                                        </div>
                                        {errors.cost && (
                                            <span className="text-xs text-red-500 font-[Outfit]">{errors.cost}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Stock Row */}
                                <div className="flex gap-5">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            Stock Disponible
                                        </label>
                                        <input
                                            type="text"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="0"
                                            className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                                        />
                                        {errors.stock && (
                                            <span className="text-xs text-red-500 font-[Outfit]">{errors.stock}</span>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col gap-2">
                                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            Stock Mínimo
                                        </label>
                                        <input
                                            type="text"
                                            value={data.min_stock}
                                            onChange={(e) => setData('min_stock', e.target.value)}
                                            placeholder="0"
                                            className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                                        />
                                        {errors.min_stock && (
                                            <span className="text-xs text-red-500 font-[Outfit]">{errors.min_stock}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-[400px] flex flex-col gap-6">
                        {/* Image Card */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Imágenes del Producto
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div className="flex flex-col items-center justify-center gap-3 h-[200px] bg-[#FBF9F7] rounded-xl border-2 border-dashed border-[#E5E5E5] cursor-pointer hover:border-[#4A5D4A] transition-colors">
                                    <div className="w-14 h-14 bg-[#E8EDE8] rounded-full flex items-center justify-center">
                                        <ImagePlus className="w-6 h-6 text-[#4A5D4A]" />
                                    </div>
                                    <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                        Arrastra imágenes aquí
                                    </span>
                                    <span className="text-[13px] text-[#999999] font-[Outfit]">
                                        o haz clic para seleccionar
                                    </span>
                                </div>
                                <span className="text-xs text-[#999999] font-[Outfit]">
                                    PNG, JPG o WEBP. Máximo 5MB por imagen.
                                </span>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Estado del Producto
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                {/* Active Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            Producto Activo
                                        </span>
                                        <span className="text-[13px] text-[#999999] font-[Outfit]">
                                            Visible en el catálogo
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                                            data.is_active ? 'bg-[#4A5D4A]' : 'bg-[#F5F3F0] border border-[#E5E5E5]'
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                                data.is_active ? 'translate-x-5' : 'translate-x-0'
                                            } ${!data.is_active ? 'border border-[#E5E5E5]' : ''}`}
                                        />
                                    </button>
                                </div>

                                {/* Featured Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                            Producto Destacado
                                        </span>
                                        <span className="text-[13px] text-[#999999] font-[Outfit]">
                                            Mostrar en página principal
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_featured', !data.is_featured)}
                                        className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                                            data.is_featured ? 'bg-[#4A5D4A]' : 'bg-[#F5F3F0] border border-[#E5E5E5]'
                                        }`}
                                    >
                                        <div
                                            className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                                data.is_featured ? 'translate-x-5' : 'translate-x-0'
                                            } ${!data.is_featured ? 'border border-[#E5E5E5]' : ''}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
