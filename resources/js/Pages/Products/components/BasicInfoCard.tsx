import { useState } from 'react';
import { Deferred } from '@inertiajs/react';
import FormulaDropdown from '@/Components/FormulaDropdown';
import type { Formula } from '@/Components/FormulaDropdown';
import CategoryDropdown from './CategoryDropdown';
import type { ProductFormData, Category } from '../types';

export default function BasicInfoCard({
    data,
    setData,
    errors,
    categories,
    formulas,
}: {
    data: ProductFormData;
    setData: (key: keyof ProductFormData, value: string) => void;
    errors: Partial<Record<string, string>>;
    categories: Category[];
    formulas: Formula[];
}) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [formulaOpen, setFormulaOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">
                    Informaci&oacute;n B&aacute;sica
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-5">
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
