export interface PricingTier {
    min_qty: string;
    max_qty: string;
    price: string;
    discount: string;
    label: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface ExistingImage {
    id: number;
    image_url: string;
    position: number;
}

export interface ProductFormData {
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
    weight_kg: string;
    width_cm: string;
    height_cm: string;
    depth_cm: string;
    images: File[];
    delete_images?: number[];
    pricing_tiers: PricingTier[];
}
