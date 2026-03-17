import { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';
import type { Formula } from '@/Components/FormulaDropdown';
import type { ProductFormData, Category } from './types';
import ProductFormHeader from './components/ProductFormHeader';
import BasicInfoCard from './components/BasicInfoCard';
import PricingInventoryCard from './components/PricingInventoryCard';
import ShippingDimensionsCard from './components/ShippingDimensionsCard';
import PricingTiersSection from './components/PricingTiersSection';
import ImageSection from './components/ImageSection';
import StatusCard from './components/StatusCard';

interface CreateProductProps extends PageProps {
    categories: Category[];
    formulas: Formula[];
}

export default function Create({ categories, formulas }: CreateProductProps) {
    const { data, setData, post, processing, errors } = useForm<ProductFormData>({
        name: '',
        slug: '',
        sku: '',
        category_id: '',
        formula_id: '',
        description: '',
        price: '',
        cost: '',
        stock: '',
        min_stock: '',
        weight_kg: '',
        width_cm: '',
        height_cm: '',
        depth_cm: '',
        is_active: true,
        is_featured: false,
        images: [],
        pricing_tiers: [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/products');
    };

    return (
        <AppLayout title="Agregar Producto" active="products">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-10 pr-12">
                <ProductFormHeader
                    title="Agregar Producto"
                    breadcrumbLabel="Agregar Producto"
                    submitLabel="Guardar Producto"
                    processing={processing}
                />

                <div className="flex gap-8">
                    <div className="flex-1 flex flex-col gap-6">
                        <BasicInfoCard
                            data={data}
                            setData={setData}
                            errors={errors}
                            categories={categories}
                            formulas={formulas}
                        />

                        <PricingInventoryCard
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        <ShippingDimensionsCard
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

                    <div className="w-[400px] flex flex-col gap-6">
                        <ImageSection
                            images={data.images}
                            onImagesChange={(images) => setData('images', images)}
                        />

                        <StatusCard
                            isActive={data.is_active}
                            isFeatured={data.is_featured}
                            onToggleActive={() => setData('is_active', !data.is_active)}
                            onToggleFeatured={() => setData('is_featured', !data.is_featured)}
                        />
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
