import type { Product } from '../../types';

export interface Order {
    id: string;
    company_id: string;
    user_id: string;
    status: 'draft' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total_amount: number;
    shipping_address: string | null;
    notes: string | null;
    created_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
    product?: Product;
}

export interface OrderWithItems extends Order {
    items: OrderItem[];
}

export interface OrderDocument {
    id: string;
    company_id: string | null;
    order_id: string | null;
    type: 'invoice' | 'delivery_note' | 'certificate' | 'tech_sheet' | 'rma';
    file_url: string;
    title: string;
    created_at: string;
}

export interface ProfileFormData {
    username?: string | null;
    full_name?: string | null;
    website?: string | null;
    avatar_url?: string | null;
}
