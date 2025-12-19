export interface Expense {
    id: string;
    description: string;
    amount: number; // Legacy field - use amount_usd, amount_usdc, or amount_wld
    amount_usd?: number; // Amount in USD
    amount_usdc?: number; // Amount in USDC (if paid with USDC)
    amount_wld?: number; // Amount in WLD (if paid with WLD)
    payer: string;
    date: string;
    group_id: string;
    splits?: { [participant: string]: number };
    split_type?: 'equal' | 'unequal' | 'percentage';
    currency?: string;
    recipient?: string;
    type?: 'expense' | 'payment';
    payment_token?: string; // Token used for crypto payment (e.g., "WLD")
    payment_token_amount?: number; // Amount in crypto tokens (deprecated - use amount_wld)
    payment_exchange_rate?: number; // Exchange rate at payment time
    is_recurring?: boolean;
    recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurrence_end_date?: string;
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
