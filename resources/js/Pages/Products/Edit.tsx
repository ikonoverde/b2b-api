import { FormEvent, useState, useRef, DragEvent } from 'react';
import { Deferred, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Save, ImagePlus, ChevronDown, X, Plus, Trash2 } from 'lucide-react';
import type { PageProps } from '@/types';
import FormulaDropdown from '@/Components/FormulaDropdown';
import type { Formula } from '@/Components/FormulaDropdown';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 4;

function processImageFiles(
    files: File[],
    remainingSlots: number,
    onValidFile: (file: File) => void,
    onPreviewReady: (preview: string) => void,
): void {
    const filesToAdd = files.slice(0, remainingSlots);

    for (const file of filesToAdd) {
        if (file.size > MAX_FILE_SIZE) {
            alert('El archivo debe ser menor a 5MB');
            continue;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            alert('Solo se permiten archivos PNG, JPG o WEBP');
            continue;
        }

        onValidFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            onPreviewReady(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
}

function removeAtIndex<T>(arr: T[], index: number): T[] {
    return arr.filter((_, i) => i !== index);
}

interface PricingTier {
    min_qty: string;
    max_qty: string;
    price: string;
    discount: string;
    label: string;
}

interface ExistingImage {
    id: number;
    image_url: string;
    position: number;
}

interface Category {
    id: number;
    name: string;
}

interface ProductFormData {
    name: string;
    slug: string;
    sku: string;
    category_id: string;
    formula_id: string;
    description: string;
    price: string;
    cost: string;
    stock: string;
    min_stock: string;
    is_active: boolean;
    is_featured: boolean;
    images: File[];
    delete_images: number[];
    pricing_tiers: PricingTier[];
}

interface ProductData {
    id: number;
    name: string;
    slug: string;
    sku: string;
    category_id: string;
    formula_id: number | null;
    description: string;
    price: string;
    cost: string;
    stock: string;
    min_stock: string;
    is_active: boolean;
    is_featured: boolean;
    image_url?: string | null;
    images: ExistingImage[];
    pricing_tiers: PricingTier[];
}

interface EditProductProps extends PageProps {
    product: ProductData;
    categories: Category[];
    formulas: Formula[];
}

function CategoryDropdown({
    categoryId,
    categories,
    isOpen,
    onToggle,
    onSelect,
    error,
}: {
    categoryId: string;
    categories: Category[];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (categoryId: string) => void;
    error?: string;
}) {
    const selectedCategory = categories.find((cat) => String(cat.id) === categoryId);

    return (
        <div className="flex-1 flex flex-col gap-2 relative">
            <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                Categor&iacute;a
            </label>
            <button
                type="button"
                onClick={onToggle}
                className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors flex items-center justify-between"
            >
                <span className={categoryId ? 'text-[#1A1A1A]' : 'text-[#999999]'}>
                    {selectedCategory?.name || 'Seleccionar categor\u00eda'}
                </span>
                <ChevronDown className="w-[18px] h-[18px] text-[#999999]" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-10 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelect(String(cat.id))}
                            className="w-full px-4 py-2.5 text-left text-sm text-[#1A1A1A] font-[Outfit] hover:bg-[#F5F3F0] transition-colors"
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
            {error && (
                <span className="text-xs text-red-500 font-[Outfit]">{error}</span>
            )}
        </div>
    );
}

function PricingTierRow({
    tier,
    index,
    errors,
    onUpdate,
    onRemove,
}: {
    tier: PricingTier;
    index: number;
    errors: Partial<Record<string, string>>;
    onUpdate: (index: number, field: keyof PricingTier, value: string) => void;
    onRemove: (index: number) => void;
}) {
    return (
        <div className="p-4 bg-[#FBF9F7] rounded-xl border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                    Nivel {index + 1}
                </span>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1.5 text-[#999999] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#666666] font-[Outfit]">
                        Cant. M&iacute;nima
                    </label>
                    <input
                        type="text"
                        value={tier.min_qty}
                        onChange={(e) => onUpdate(index, 'min_qty', e.target.value)}
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
                        Cant. M&aacute;xima
                    </label>
                    <input
                        type="text"
                        value={tier.max_qty}
                        onChange={(e) => onUpdate(index, 'max_qty', e.target.value)}
                        placeholder="Sin l&iacute;mite"
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
                            onChange={(e) => onUpdate(index, 'price', e.target.value)}
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
                            onChange={(e) => onUpdate(index, 'discount', e.target.value)}
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
                        onChange={(e) => onUpdate(index, 'label', e.target.value)}
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
    );
}

function ImagePreview({
    src,
    alt,
    onRemove,
}: {
    src: string;
    alt: string;
    onRemove: () => void;
}) {
    return (
        <div className="relative h-[120px] bg-[#FBF9F7] rounded-xl border-2 border-[#E5E5E5] overflow-hidden">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
                <X className="w-3 h-3 text-[#666666]" />
            </button>
        </div>
    );
}

function ImageDropZone({
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onClick,
}: {
    isDragging: boolean;
    onDragOver: (e: DragEvent<HTMLElement>) => void;
    onDragLeave: (e: DragEvent<HTMLElement>) => void;
    onDrop: (e: DragEvent<HTMLElement>) => void;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center gap-2 h-[120px] w-full bg-[#FBF9F7] rounded-xl border-2 border-dashed ${
                isDragging ? 'border-[#4A5D4A] bg-[#E8EDE8]' : 'border-[#E5E5E5]'
            } hover:border-[#4A5D4A] transition-colors`}
        >
            <ImagePlus className="w-6 h-6 text-[#4A5D4A]" />
            <span className="text-xs text-[#999999] font-[Outfit]">
                Agregar
            </span>
        </button>
    );
}

function ToggleSwitch({
    enabled,
    onToggle,
    label,
    description,
}: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                    {label}
                </span>
                <span className="text-[13px] text-[#999999] font-[Outfit]">
                    {description}
                </span>
            </div>
            <button
                type="button"
                onClick={onToggle}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                    enabled ? 'bg-[#4A5D4A]' : 'bg-[#F5F3F0] border border-[#E5E5E5]'
                }`}
            >
                <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    } ${!enabled ? 'border border-[#E5E5E5]' : ''}`}
                />
            </button>
        </div>
    );
}

function BasicInfoCard({
    data,
    setData,
    errors,
    categories,
    categoryOpen,
    setCategoryOpen,
    formulas,
    formulaOpen,
    setFormulaOpen,
}: {
    data: ProductFormData;
    setData: (key: keyof ProductFormData, value: string) => void;
    errors: Partial<Record<string, string>>;
    categories: Category[];
    categoryOpen: boolean;
    setCategoryOpen: (open: boolean) => void;
    formulas: Formula[];
    formulaOpen: boolean;
    setFormulaOpen: (open: boolean) => void;
}) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Informaci&oacute;n B&aacute;sica
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
                        placeholder="Ej: Camiseta B&aacute;sica Algod&oacute;n"
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
                            SKU / C&oacute;digo
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

                    <CategoryDropdown
                        categoryId={data.category_id}
                        categories={categories}
                        isOpen={categoryOpen}
                        onToggle={() => setCategoryOpen(!categoryOpen)}
                        onSelect={(id) => {
                            setData('category_id', id);
                            setCategoryOpen(false);
                        }}
                        error={errors.category_id}
                    />
                </div>

                {/* Formula Field */}
                <Deferred data="formulas" fallback={
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">F&oacute;rmula</span>
                        <div className="h-11 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] animate-pulse" />
                    </div>
                }>
                    <FormulaDropdown
                        formulaId={data.formula_id}
                        formulas={formulas}
                        isOpen={formulaOpen}
                        onToggle={() => setFormulaOpen(!formulaOpen)}
                        onSelect={(id) => {
                            setData('formula_id', id);
                            setFormulaOpen(false);
                        }}
                        error={errors.formula_id}
                    />
                </Deferred>

                {/* Slug Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                        Slug (URL amigable)
                    </label>
                    <input
                        type="text"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        placeholder="ej: fertilizante-premium"
                        className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                    />
                    {errors.slug && (
                        <span className="text-xs text-red-500 font-[Outfit]">{errors.slug}</span>
                    )}
                    <span className="text-xs text-[#999999] font-[Outfit]">
                        URL: /products/{data.slug || 'slug-del-producto'}
                    </span>
                </div>

                {/* Description Field */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                        Descripci&oacute;n
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Describe las caracter&iacute;sticas del producto..."
                        rows={4}
                        className="p-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm text-[#1A1A1A] placeholder-[#999999] font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors resize-none leading-relaxed"
                    />
                    {errors.description && (
                        <span className="text-xs text-red-500 font-[Outfit]">{errors.description}</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function PricingInventoryCard({
    data,
    setData,
    errors,
}: {
    data: ProductFormData;
    setData: (key: keyof ProductFormData, value: string) => void;
    errors: Partial<Record<string, string>>;
}) {
    return (
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
                            Stock M&iacute;nimo
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
    );
}

function PricingTiersSection({
    tiers,
    errors,
    onTiersChange,
}: {
    tiers: PricingTier[];
    errors: Partial<Record<string, string>>;
    onTiersChange: (tiers: PricingTier[]) => void;
}) {
    const addPricingTier = () => {
        const lastTier = tiers[tiers.length - 1];
        const suggestedMinQty = lastTier && lastTier.max_qty ? String(parseInt(lastTier.max_qty) + 1) : '1';

        onTiersChange([
            ...tiers,
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
        onTiersChange(tiers.filter((_, i) => i !== index));
    };

    const updatePricingTier = (index: number, field: keyof PricingTier, value: string) => {
        const updatedTiers = [...tiers];
        updatedTiers[index] = { ...updatedTiers[index], [field]: value };
        onTiersChange(updatedTiers);
    };

    return (
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

                {tiers.length === 0 ? (
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
                        {tiers.map((tier, index) => (
                            <PricingTierRow
                                key={index}
                                tier={tier}
                                index={index}
                                errors={errors}
                                onUpdate={updatePricingTier}
                                onRemove={removePricingTier}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function EditImageSection({
    images,
    onImagesChange,
    existingImages,
    onExistingImageRemove,
}: {
    images: File[];
    onImagesChange: (images: File[]) => void;
    existingImages: ExistingImage[];
    onExistingImageRemove: (id: number) => void;
}) {
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalImages = existingImages.length + newImagePreviews.length;
    const canAddMore = totalImages < MAX_IMAGES;

    const addFiles = (files: File[]) => {
        processImageFiles(
            files,
            MAX_IMAGES - totalImages,
            (file) => onImagesChange([...images, file]),
            (preview) => setNewImagePreviews((prev) => [...prev, preview]),
        );
    };

    const removeNewImage = (index: number) => {
        setNewImagePreviews(removeAtIndex(newImagePreviews, index));
        onImagesChange(removeAtIndex(images, index));
    };

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Im&aacute;genes del Producto
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => { if (e.target.files) { addFiles(Array.from(e.target.files)); } }}
                    multiple
                    className="hidden"
                />
                <div className="grid grid-cols-2 gap-3">
                    {existingImages.map((img) => (
                        <ImagePreview
                            key={img.id}
                            src={img.image_url}
                            alt="Product image"
                            onRemove={() => onExistingImageRemove(img.id)}
                        />
                    ))}
                    {newImagePreviews.map((preview, index) => (
                        <ImagePreview
                            key={`new-${index}`}
                            src={preview}
                            alt="New product image"
                            onRemove={() => removeNewImage(index)}
                        />
                    ))}
                    {canAddMore && (
                        <ImageDropZone
                            isDragging={isDragging}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(Array.from(e.dataTransfer.files)); }}
                            onClick={() => fileInputRef.current?.click()}
                        />
                    )}
                </div>
                <span className="text-xs text-[#999999] font-[Outfit]">
                    PNG, JPG o WEBP. M&aacute;ximo 5MB por imagen. Hasta 4 im&aacute;genes.
                </span>
            </div>
        </div>
    );
}

export default function Edit({ product, categories, formulas }: EditProductProps) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [formulaOpen, setFormulaOpen] = useState(false);
    const [existingImages, setExistingImages] = useState<ExistingImage[]>(product.images || []);

    const { data, setData, post, processing, errors } = useForm<ProductFormData & { _method: string }>({
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        category_id: String(product.category_id),
        formula_id: product.formula_id ? String(product.formula_id) : '',
        description: product.description,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        min_stock: product.min_stock,
        is_active: product.is_active,
        is_featured: product.is_featured,
        images: [],
        delete_images: [],
        pricing_tiers: product.pricing_tiers || [],
        _method: 'put',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`);
    };

    const removeExistingImage = (id: number) => {
        setExistingImages(existingImages.filter((img) => img.id !== id));
        setData('delete_images', [...data.delete_images, id]);
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
                        <BasicInfoCard
                            data={data}
                            setData={setData}
                            errors={errors}
                            categories={categories}
                            categoryOpen={categoryOpen}
                            setCategoryOpen={setCategoryOpen}
                            formulas={formulas}
                            formulaOpen={formulaOpen}
                            setFormulaOpen={setFormulaOpen}
                        />

                        <PricingInventoryCard
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        <PricingTiersSection
                            tiers={data.pricing_tiers}
                            errors={errors}
                            onTiersChange={(tiers) => setData('pricing_tiers', tiers)}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="w-[400px] flex flex-col gap-6">
                        <EditImageSection
                            images={data.images}
                            onImagesChange={(images) => setData('images', images)}
                            existingImages={existingImages}
                            onExistingImageRemove={removeExistingImage}
                        />

                        {/* Status Card */}
                        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Estado del Producto
                                </h2>
                            </div>
                            <div className="p-6 flex flex-col gap-5">
                                <ToggleSwitch
                                    enabled={data.is_active}
                                    onToggle={() => setData('is_active', !data.is_active)}
                                    label="Producto Activo"
                                    description="Visible en el cat&aacute;logo"
                                />
                                <ToggleSwitch
                                    enabled={data.is_featured}
                                    onToggle={() => setData('is_featured', !data.is_featured)}
                                    label="Producto Destacado"
                                    description="Mostrar en p&aacute;gina principal"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
