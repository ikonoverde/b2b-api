export interface User {
    id: number;
    name: string;
    email: string;
    initials: string;
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
