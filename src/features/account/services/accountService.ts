import { supabase } from '../../../lib/supabase';
import type { Order, OrderWithItems, OrderDocument, ProfileFormData } from '../types';

export const accountService = {
    async fetchUserOrders(userId: string): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Order[];
    },

    async fetchOrderDetails(orderId: string): Promise<OrderWithItems> {
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError) throw orderError;

        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*, product:products(*)')
            .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        return { ...order, items: items || [] } as OrderWithItems;
    },

    async fetchOrderDocuments(orderId: string): Promise<OrderDocument[]> {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as OrderDocument[];
    },

    async updateUserProfile(userId: string, profileData: ProfileFormData): Promise<void> {
        const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', userId);

        if (error) throw error;
    }
};
