import { lazy, Suspense, useState } from 'react';
import { Deferred } from '@inertiajs/react';
import FormulaDropdown from '@/Components/FormulaDropdown';
import type { Formula } from '@/Components/FormulaDropdown';
import CategoryDropdown from './CategoryDropdown';
import type { ProductFormData, Category } from '../types';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));

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
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Informaci&oacute;n B&aacute;sica
                </h2>
            </div>
            <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Nombre del Producto
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ej: Camiseta B&aacute;sica Algod&oacute;n"
                        className="h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                    {errors.name && (
                        <span className="text-xs text-destructive">{errors.name}</span>
                    )}
                </div>

                <div className="flex gap-5">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            SKU / C&oacute;digo
                        </label>
                        <input
                            type="text"
                            value={data.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                            placeholder="Ej: CAM-BAS-001"
                            className="h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
                        />
                        {errors.sku && (
                            <span className="text-xs text-destructive">{errors.sku}</span>
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
                        <span className="text-sm font-medium text-foreground">F&oacute;rmula</span>
                        <div className="h-11 bg-background rounded-lg border border-border animate-pulse" />
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
                    <label className="text-sm font-medium text-foreground">
                        Slug (URL amigable)
                    </label>
                    <input
                        type="text"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        placeholder="ej: fertilizante-premium"
                        className="h-11 px-4 bg-background rounded-lg border border-border text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                    {errors.slug && (
                        <span className="text-xs text-destructive">{errors.slug}</span>
                    )}
                    <span className="text-xs text-muted-foreground">
                        URL: /products/{data.slug || 'slug-del-producto'}
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Descripci&oacute;n (Markdown)
                    </label>
                    <Suspense
                        fallback={
                            <div className="h-[300px] bg-background rounded-lg border border-border animate-pulse" />
                        }
                    >
                        <div data-color-mode="light">
                            <MDEditor
                                value={data.description}
                                onChange={(val) => setData('description', val || '')}
                                height={300}
                            />
                        </div>
                    </Suspense>
                    {errors.description && (
                        <span className="text-xs text-destructive">{errors.description}</span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Ingredientes activos (Markdown)
                    </label>
                    <Suspense
                        fallback={
                            <div className="h-[220px] bg-background rounded-lg border border-border animate-pulse" />
                        }
                    >
                        <div data-color-mode="light">
                            <MDEditor
                                value={data.active_ingredients}
                                onChange={(val) => setData('active_ingredients', val || '')}
                                height={220}
                            />
                        </div>
                    </Suspense>
                    {errors.active_ingredients && (
                        <span className="text-xs text-destructive">{errors.active_ingredients}</span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                        Recomendaciones (Markdown)
                    </label>
                    <Suspense
                        fallback={
                            <div className="h-[220px] bg-background rounded-lg border border-border animate-pulse" />
                        }
                    >
                        <div data-color-mode="light">
                            <MDEditor
                                value={data.recommendations}
                                onChange={(val) => setData('recommendations', val || '')}
                                height={220}
                            />
                        </div>
                    </Suspense>
                    {errors.recommendations && (
                        <span className="text-xs text-destructive">{errors.recommendations}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
