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
}

export interface Kit {
    id: string;
    name: string;
    type: KitType;
    total_power: number; // in kW
    price: number;
    monthly_finance_cost: number;
    description: string;
    image_url: string;
    stock?: number;
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
