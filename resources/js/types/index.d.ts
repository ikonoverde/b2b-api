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
}

export interface UserActivity {
    total_orders: number;
    total_spent: number;
    last_order_date: string | null;
    account_age_days: number;
}

export interface PageProps {
    auth: {
        user: User | null;
    };
    cartItemCount: number;
    flash: {
        success?: string;
        error?: string;
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

export interface CartTotals {
    subtotal: number;
    shipping: number;
    total: number;
}

export interface Cart {
    items: CartItem[];
    totals: CartTotals;
}

export interface ProductImage {
    id: number;
    url: string;
}

export interface PricingTier {
    min_qty: number;
    max_qty: number | null;
    price: number;
    discount: number;
    label: string | null;
}

export interface ProductDetail {
    id: number;
    name: string;
    sku: string;
    category: string;
    description: string | null;
    price: number;
    size: string | null;
    images: ProductImage[];
    pricing_tiers: PricingTier[];
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
    shipping_address: Record<string, string> | null;
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
