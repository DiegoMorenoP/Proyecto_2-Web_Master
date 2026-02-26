export type ProductType = 'panel' | 'inverter' | 'battery';
export type KitType = 'isolated' | 'grid' | 'hybrid';

export interface Product {
    id: string;
    name: string;
    type: ProductType;
    price: number;
    voltage?: number;
    tech_spec_pdf?: string;
    image_url: string;
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
    stock: number;
    popularity_score: number;
}

export interface Kit {
    id: string;
    name: string;
    type: KitType | ProductType | string;
    total_power?: number; // in kW, optional for non-kits
    price: number;
    base_price?: number;
    monthly_finance_cost?: number; // optional for non-kits
    description?: string;
    image_url: string;
    stock: number;
    stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
    popularity_score?: number;
    category_slug?: string;
    subcategory_slug?: string;
    specifications?: any;
}

export interface Lead {
    id: string;
    email: string;
    address: string;
    monthly_bill: number;
    roof_type: string;
    created_at: string;
}

export interface Simulation {
    id: string;
    lead_id: string;
    recommended_kit_id: string;
    estimated_savings_year_1: number;
    created_at: string;
}
