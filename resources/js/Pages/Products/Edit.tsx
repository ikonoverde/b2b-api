import { FormEvent, useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Save, ImagePlus, ChevronDown, X, Plus, Trash2 } from 'lucide-react';
import type { PageProps } from '@/types';

interface PricingTier {
    min_qty: string;
    max_qty: string;
    price: string;
    discount: string;
    label: string;
}

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
    image?: File | null;
    pricing_tiers: PricingTier[];
}

interface ProductData extends ProductForm {
    id: number;
    image_url?: string | null;
}

interface EditProductProps extends PageProps {
    product: ProductData;
    categories: string[];
}

export default function Edit({ product, categories }: EditProductProps) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(product.image_url ?? null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<ProductForm & { _method: string }>({
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
        image: null,
        pricing_tiers: product.pricing_tiers || [],
        _method: 'put',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`);
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFile = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo debe ser menor a 5MB');
            return;
        }

        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            alert('Solo se permiten archivos PNG, JPG o WEBP');
            return;
        }

        setData('image', file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addPricingTier = () => {
        const lastTier = data.pricing_tiers[data.pricing_tiers.length - 1];
        const suggestedMinQty = lastTier && lastTier.max_qty ? String(parseInt(lastTier.max_qty) + 1) : '1';

        setData('pricing_tiers', [
            ...data.pricing_tiers,
            {
                min_qty: suggestedMinQty,
                max_qty: '',
                price: '',
                discount: '',
                label: '',
            },
        ]);
    };

    const removePricingTier = (index: number) => {
        setData(
            'pricing_tiers',
            data.pricing_tiers.filter((_, i) => i !== index)
        );
    };

    const updatePricingTier = (index: number, field: keyof PricingTier, value: string) => {
        const updatedTiers = [...data.pricing_tiers];
        updatedTiers[index] = { ...updatedTiers[index], [field]: value };
        setData('pricing_tiers', updatedTiers);
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

                        {/* Pricing Tiers Card */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Niveles de Precios
                                </h2>
                                <button
                                    type="button"
                                    onClick={addPricingTier}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E8EDE8] rounded-lg text-sm font-medium text-[#4A5D4A] font-[Outfit] hover:bg-[#d9e2d9] transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                {errors.pricing_tiers && (
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                        <span className="text-xs text-red-600 font-[Outfit]">{errors.pricing_tiers}</span>
                                    </div>
                                )}

                                {data.pricing_tiers.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <span className="text-sm text-[#999999] font-[Outfit]">
                                            No hay niveles de precios configurados.
                                        </span>
                                        <span className="text-xs text-[#BBBBBB] font-[Outfit] mt-1">
                                            Los niveles permiten ofrecer descuentos por volumen.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {data.pricing_tiers.map((tier, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-[#FBF9F7] rounded-xl border border-[#E5E5E5]"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                                        Nivel {index + 1}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePricingTier(index)}
                                                        className="p-1.5 text-[#999999] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                                                            Cant. Mínima
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={tier.min_qty}
                                                            onChange={(e) => updatePricingTier(index, 'min_qty', e.target.value)}
                                                            placeholder="1"
                                                            className="h-9 px-3 bg-white rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                                                        />
                                                        {errors[`pricing_tiers.${index}.min_qty`] && (
                                                            <span className="text-xs text-red-500 font-[Outfit]">
                                                                {errors[`pricing_tiers.${index}.min_qty`]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                                                            Cant. Máxima
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={tier.max_qty}
                                                            onChange={(e) => updatePricingTier(index, 'max_qty', e.target.value)}
                                                            placeholder="Sin límite"
                                                            className="h-9 px-3 bg-white rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                                                        />
                                                        {errors[`pricing_tiers.${index}.max_qty`] && (
                                                            <span className="text-xs text-red-500 font-[Outfit]">
                                                                {errors[`pricing_tiers.${index}.max_qty`]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                                                            Precio
                                                        </label>
                                                        <div className="flex h-9 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                                                            <div className="flex items-center px-2 bg-[#F5F3F0] border-r border-[#E5E5E5]">
                                                                <span className="text-xs text-[#666666] font-[Outfit]">$</span>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={tier.price}
                                                                onChange={(e) => updatePricingTier(index, 'price', e.target.value)}
                                                                placeholder="0.00"
                                                                className="flex-1 px-2 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                                                            />
                                                        </div>
                                                        {errors[`pricing_tiers.${index}.price`] && (
                                                            <span className="text-xs text-red-500 font-[Outfit]">
                                                                {errors[`pricing_tiers.${index}.price`]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-1.5">
                                                        <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                                                            Descuento
                                                        </label>
                                                        <div className="flex h-9 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden focus-within:border-[#4A5D4A] transition-colors">
                                                            <input
                                                                type="text"
                                                                value={tier.discount}
                                                                onChange={(e) => updatePricingTier(index, 'discount', e.target.value)}
                                                                placeholder="0"
                                                                className="flex-1 px-2 bg-transparent text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none"
                                                            />
                                                            <div className="flex items-center px-2 bg-[#F5F3F0] border-l border-[#E5E5E5]">
                                                                <span className="text-xs text-[#666666] font-[Outfit]">%</span>
                                                            </div>
                                                        </div>
                                                        {errors[`pricing_tiers.${index}.discount`] && (
                                                            <span className="text-xs text-red-500 font-[Outfit]">
                                                                {errors[`pricing_tiers.${index}.discount`]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="col-span-2 flex flex-col gap-1.5">
                                                        <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                                                            Etiqueta
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={tier.label}
                                                            onChange={(e) => updatePricingTier(index, 'label', e.target.value)}
                                                            placeholder="Ej: Mayorista, Distribuidor"
                                                            className="h-9 px-3 bg-white rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                                                        />
                                                        {errors[`pricing_tiers.${index}.label`] && (
                                                            <span className="text-xs text-red-500 font-[Outfit]">
                                                                {errors[`pricing_tiers.${index}.label`]}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                {imagePreview ? (
                                    <div className="relative h-[200px] bg-[#FBF9F7] rounded-xl border-2 border-[#E5E5E5] overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                        >
                                            <X className="w-4 h-4 text-[#666666]" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`flex flex-col items-center justify-center gap-3 h-[200px] bg-[#FBF9F7] rounded-xl border-2 border-dashed ${
                                            isDragging ? 'border-[#4A5D4A] bg-[#E8EDE8]' : 'border-[#E5E5E5]'
                                        } cursor-pointer hover:border-[#4A5D4A] transition-colors`}
                                    >
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
                                )}
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
