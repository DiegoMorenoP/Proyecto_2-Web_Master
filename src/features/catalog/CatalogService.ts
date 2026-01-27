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
    async getKits(): Promise<Kit[]> {
        const { data, error } = await supabase
            .from('kits')
            .select('*')
            .order('popularity_score', { ascending: false });

        if (error || !data || data.length === 0) {
            console.error('CRITICAL DATABASE ERROR:', error);
            console.warn('Using mock data because DB is empty or unreachable');
            return MOCK_KITS;
        }

        console.log('Raw DB Kits:', data);

        return data.map((kit: any) => {
            // Force stock to be a number. Handle strings, nulls, undefined.
            const rawStock = kit.stock;
            const stock = typeof rawStock === 'string' ? parseInt(rawStock, 10) : (rawStock ?? 0);

            // Validate parsed stock
            const finalStock = isNaN(stock) ? 0 : stock;

            let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';

            if (finalStock <= 0) {
                status = 'out_of_stock';
            } else if (finalStock <= 5) {
                status = 'low_stock';
            }

            // console.log(`Processed Kit: ${kit.name} | Raw Stock: ${rawStock} | Final Stock: ${finalStock} | Status: ${status}`);

            return {
                ...kit,
                stock: finalStock,
                stock_status: status
            };
        }) as Kit[];
    }
};
