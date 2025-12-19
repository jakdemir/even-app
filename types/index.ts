export interface Expense {
    id: string;
    description: string;
    amount: number;
    payer: string;
    date: string;
    type: 'expense' | 'payment';
    group_id: string;
    recipient?: string;
    split_type?: 'equal' | 'unequal' | 'percentage';
    splits?: Record<string, number>; // For unequal splits: { userId: amount or percentage }
    currency?: string;
    is_recurring?: boolean;
    recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurrence_end_date?: string;
    payment_token?: string; // Token used for crypto payment (e.g., "WLD")
    payment_token_amount?: number; // Amount in crypto tokens (e.g., 5.0000)
    payment_exchange_rate?: number; // Exchange rate at payment time (e.g., 2.00 USD per WLD)
}

export interface Group {
    id: string;
    name: string;
    created_by: string;
    created_at: string;
}

export interface GroupMember {
    group_id: string;
    user_id: string;
    joined_at: string;
}
