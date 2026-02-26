import { supabase } from '../../lib/supabase';
import type { Kit } from '../../types';

const MOCK_KITS: Kit[] = [
    {
        id: 'mock-1',
        name: 'Starter Eco Kit (3kW)',
        type: 'grid',
        total_power: 3.0,
        price: 4500.00,
        monthly_finance_cost: 45.00,
        description: 'Ideal fo small apartments. Includes essential panels and efficient inverter.',
        image_url: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b0?auto=format&fit=crop&w=800&q=80',
        popularity_score: 95,
        stock: 5
    },
    {
        id: 'mock-2',
        name: 'Family Balance Kit (5kW)',
        type: 'grid',
        total_power: 5.0,
        price: 6800.00,
        monthly_finance_cost: 65.00,
        description: 'Perfect for standard families (3-4 people). Covers AC, laundry, and daily appliances.',
        image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        popularity_score: 88,
        stock: 3
    },
    {
        id: 'mock-3',
        name: 'Pro Autonomy Pack (8kW)',
        type: 'hybrid',
        total_power: 8.0,
        price: 12500.00,
        monthly_finance_cost: 120.00,
        description: 'Designed for large homes. Includes battery storage for night usage.',
        image_url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80',
        popularity_score: 92,
        stock: 0
    }
];

export const CatalogService = {
    async getAllCatalog(): Promise<Kit[]> {
        const [kitsRes, prodsRes] = await Promise.all([
            supabase.from('kits').select('*'),
            supabase.from('products').select('*')
        ]);

        let allItems: any[] = [];
        if (kitsRes.data) allItems = [...allItems, ...kitsRes.data];
        if (prodsRes.data) allItems = [...allItems, ...prodsRes.data];

        return allItems.map(formatKitItem).sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
    },

    async getKits(categorySlug?: string, subcategorySlug?: string): Promise<Kit[]> {
        if (!categorySlug && !subcategorySlug) return this.getAllCatalog();

        const table = categorySlug === 'kits-solares' ? 'kits' : 'products';
        let query = supabase.from(table).select('*');

        if (categorySlug && table === 'products') {
            query = query.eq('category_slug', categorySlug);
        }
        if (subcategorySlug) {
            query = query.eq('subcategory_slug', subcategorySlug);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            console.error('CRITICAL DATABASE ERROR:', error);
            return MOCK_KITS;
        }

        return data.map(formatKitItem);
    }
};

function formatKitItem(kit: any): Kit {
    const rawStock = kit.stock;
    const finalStock = typeof rawStock === 'number' ? rawStock : (typeof rawStock === 'string' ? parseInt(rawStock, 10) : undefined);

    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = kit.stock_status || 'in_stock';

    // Fallback if numeric stock is explicitly specified and we want to enforce it overriding DB
    if (finalStock !== undefined) {
        if (finalStock <= 0) status = 'out_of_stock';
        else if (finalStock <= 5) status = 'low_stock';
    }

    return {
        ...kit,
        stock: finalStock,
        stock_status: status
    } as Kit;
}
