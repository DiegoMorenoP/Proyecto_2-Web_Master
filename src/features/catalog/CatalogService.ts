import { supabase } from '../../lib/supabase';
import type { Kit } from '../../types';

export const CatalogService = {
    async getKits(): Promise<Kit[]> {
        const { data, error } = await supabase
            .from('kits')
            .select('*')
            .order('price', { ascending: true });

        if (error) {
            console.error('Error fetching kits:', error);
            return [];
        }

        return data as Kit[];
    }
};
