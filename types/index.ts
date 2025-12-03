export interface Expense {
    id: string;
    description: string;
    amount: number;
    payer: string;
    date: string;
    type: 'expense' | 'payment';
}
