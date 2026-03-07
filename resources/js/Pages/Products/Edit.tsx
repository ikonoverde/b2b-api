import { FormEvent, useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';
import type { Formula } from '@/Components/FormulaDropdown';
import type { ProductFormData, Category, ExistingImage, PricingTier } from './types';
import ProductFormHeader from './components/ProductFormHeader';
import BasicInfoCard from './components/BasicInfoCard';
import PricingInventoryCard from './components/PricingInventoryCard';
import PricingTiersSection from './components/PricingTiersSection';
import ImageSection from './components/ImageSection';
import StatusCard from './components/StatusCard';

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

export default function Edit({ product, categories, formulas }: EditProductProps) {
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
        setData('delete_images', [...(data.delete_images ?? []), id]);
    };

    return (
        <AppLayout title="Editar Producto" active="products">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-10 pr-12">
                <ProductFormHeader
                    title="Editar Producto"
                    breadcrumbLabel="Editar Producto"
                    submitLabel="Actualizar Producto"
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
                            existingImages={existingImages}
                            onExistingImageRemove={removeExistingImage}
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
