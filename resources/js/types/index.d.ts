export interface User {
    id: number;
    name: string;
    email: string;
    initials: string;
    role: string;
}

export interface DetailedUser {
    id: number;
    name: string;
    email: string;
    rfc: string | null;
    phone: string | null;
    role: string;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    pm_type: string | null;
    pm_last_four: string | null;
}

export interface UserOrder {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    shipping_cost: number;
    created_at: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
    product?: {
        slug: string;
    };
}

export interface UserActivity {
    total_orders: number;
    total_spent: number;
    last_order_date: string | null;
    account_age_days: number;
}

export interface ReorderUnavailableItem {
    product_id: number;
    product_name: string;
    reason: 'product_unavailable' | 'out_of_stock';
}

export interface ReorderPriceChange {
    product_id: number;
    product_name: string;
    original_price: number;
    current_price: number;
}

export interface ReorderWarnings {
    unavailable: ReorderUnavailableItem[];
    price_changes: ReorderPriceChange[];
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    miniCart: MiniCart | null;
    flash: {
        success?: string;
        error?: string;
        password_status?: string;
        reorder_warnings?: ReorderWarnings;
    };
    [key: string]: unknown;
}

export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    image: string | null;
    price: number;
    quantity: number;
    subtotal: number;
}

export type MiniCartItem = Omit<CartItem, 'product_id'>;

export interface MiniCart {
    items: MiniCartItem[];
    subtotal: number;
    totalCount: number;
}

export interface CartTotals {
    subtotal: number;
    shipping: number | null;
    total: number | null;
}

export interface ShippingQuote {
    carrier: string;
    service: string;
    price: number;
    estimated_days: number;
    quote_id: string;
    rate_id: string;
}

export interface Cart {
    items: CartItem[];
    totals: CartTotals;
}

export interface ProductImage {
    id: number;
    url: string;
    position?: number;
}

export interface PricingTier {
    min_qty: number;
    max_qty: number | null;
    price: number;
    discount: number;
    label: string | null;
}

export interface BreadcrumbItem {
    name: string;
    slug: string | null;
    url: string | null;
}

export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    sku: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    description: string | null;
    price: number;
    sale_price: number | null;
    discount_percentage: number | null;
    stock: number;
    is_active: boolean;
    weight_kg: number | null;
    width_cm: number | null;
    height_cm: number | null;
    depth_cm: number | null;
    images: ProductImage[];
    pricing_tiers: PricingTier[];
    breadcrumbs: BreadcrumbItem[];
}

export interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
}

export interface CustomerProfile {
    orders_count: number;
    total_spent: number;
    discount_percentage?: number;
}

export interface Stat {
    label: string;
    value: string;
    change: string;
    positive: boolean | null;
    footer: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    featured?: boolean;
}

export interface Order {
    id: string;
    customer: string;
    initials: string;
    amount: string;
    status: 'Paid' | 'Pending';
}

export interface Activity {
    id: number;
    title: string;
    time: string;
    type: 'success' | 'info' | 'warning' | 'error' | 'review';
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'low_stock';
    image: string | null;
    has_pending_orders?: boolean;
}

export interface AdminOrderCustomer {
    id: number;
    name: string;
    email: string;
}

export interface AdminOrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
}

export interface OrderStatusHistoryEntry {
    id: number;
    from_status: string | null;
    to_status: string;
    note: string | null;
    admin_name: string | null;
    created_at: string;
}

export interface OrderNoteEntry {
    id: number;
    content: string;
    admin_name: string | null;
    created_at: string;
}

export interface AdminOrder {
    id: number;
    status: string;
    payment_status: string;
    payment_intent_id: string | null;
    total_amount: number;
    shipping_cost: number;
    refunded_amount: number;
    tracking_number: string | null;
    shipping_carrier: string | null;
    tracking_url: string | null;
    shipping_address: Record<string, string> | null;
    label_url: string | null;
    label_error: string | null;
    skydropx_shipment_id: string | null;
    shipping_quote_source: string | null;
    created_at: string;
    updated_at: string;
    customer: AdminOrderCustomer | null;
    shipping_method: { id: number; name: string } | null;
    items: AdminOrderItem[];
    status_histories: OrderStatusHistoryEntry[];
    notes: OrderNoteEntry[];
}

export interface AdminOrderListItem {
    id: number;
    status: string;
    payment_status: string;
    total_amount: number;
    created_at: string;
    user: AdminOrderCustomer;
}

export interface OrderFilters {
    status: string;
    payment_status: string;
    date_from: string;
    date_to: string;
    customer: string;
    amount_min: string;
    amount_max: string;
    sort_by: string;
    sort_order: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    parent_id: number | null;
    display_order: number;
    children?: Category[];
    products_count?: number;
    depth?: number;
}

export interface PaymentMethodCard {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
}

export interface PaymentMethod {
    id: string;
    type: string;
    card: PaymentMethodCard;
    is_default: boolean;
}

export interface Address {
    id: number;
    label: string;
    name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    postal_code: string;
    phone: string | null;
    is_default: boolean;
    country: string;
    created_at: string;
    updated_at: string;
}

export interface AddressFormData {
    label: string;
    name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    is_default: boolean;
}
