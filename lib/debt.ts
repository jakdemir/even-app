import { Expense } from "@/types";

export interface Debt {
    debtor: string;   // Who owes money
    creditor: string; // Who is owed money
    amount: number;   // How much
}

export interface Balance {
    user: string;
    amount: number; // Positive = Owed money, Negative = Owes money
}

/**
 * Calculates the simplified debts for a group of expenses.
 * Uses a greedy algorithm to minimize the number of transactions.
 */
export function calculateDebts(expenses: Expense[], currentUser: string): Debt[] {
    // 1. Identify all participants (everyone who has paid + current user + recipients)
    const participants = new Set<string>();
    participants.add(currentUser);
    expenses.forEach(e => {
        participants.add(e.payer);
        if (e.recipient) participants.add(e.recipient);
    });

    const users = Array.from(participants);
    const numUsers = users.length;

    if (numUsers < 2) return [];

    // 2. Calculate Net Balances
    const balances: Record<string, number> = {};
    users.forEach(u => balances[u] = 0);

    expenses.forEach(expense => {
        if (expense.type === 'payment') {
            // Direct transfer: Payer pays Recipient
            if (expense.recipient) {
                balances[expense.payer] += expense.amount;
                balances[expense.recipient] -= expense.amount;
            }
        } else {
            // Shared Expense: Payer paid full amount. Cost is split equally among all.
            const costPerPerson = expense.amount / numUsers;

            // Payer gets back (Amount - TheirShare)
            balances[expense.payer] += expense.amount;

            // Everyone (including payer) "pays" the cost
            users.forEach(u => {
                balances[u] -= costPerPerson;
            });
        }
    });

    // 3. Separate into Debtors and Creditors
    let debtors: Balance[] = [];
    let creditors: Balance[] = [];

    Object.entries(balances).forEach(([user, amount]) => {
        // Round to 2 decimals to avoid floating point errors
        const rounded = Math.round(amount * 100) / 100;
        if (rounded < -0.01) debtors.push({ user, amount: rounded });
        if (rounded > 0.01) creditors.push({ user, amount: rounded });
    });

    // Sort by magnitude (optimization for greedy matching)
    debtors.sort((a, b) => a.amount - b.amount); // Ascending (most negative first)
    creditors.sort((a, b) => b.amount - a.amount); // Descending (most positive first)

    // 4. Greedy Matching
    const debts: Debt[] = [];
    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to settle is the minimum of what debtor owes and creditor is owed
        const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

        // Record the debt
        debts.push({
            debtor: debtor.user,
            creditor: creditor.user,
            amount: Math.round(amount * 100) / 100
        });

        // Update balances
        debtor.amount += amount;
        creditor.amount -= amount;

        // Move indices if settled (within small epsilon)
        if (Math.abs(debtor.amount) < 0.01) i++;
        if (creditor.amount < 0.01) j++;
    }

    return debts;
}
