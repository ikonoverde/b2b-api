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
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
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
