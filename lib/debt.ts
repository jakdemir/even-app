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
    console.log("=== DEBT CALCULATION START ===");
    console.log("Current user:", currentUser);
    console.log("Expenses:", expenses);

    // 1. Identify all participants (everyone who has paid + current user + recipients + people in splits)
    const participants = new Set<string>();
    participants.add(currentUser);
    expenses.forEach(e => {
        participants.add(e.payer);
        if (e.recipient) participants.add(e.recipient);
        // Also add people from splits (for legacy data that might have "Me")
        if (e.splits) {
            Object.keys(e.splits).forEach(person => {
                // Treat "Me" as the current user
                if (person === "Me") {
                    participants.add(currentUser);
                } else {
                    participants.add(person);
                }
            });
        }
    });

    const users = Array.from(participants);
    const numUsers = users.length;

    console.log("Participants:", users);
    console.log("Number of users:", numUsers);

    if (numUsers < 2) {
        console.log("Less than 2 users, returning empty debts");
        return [];
    }

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
            // Shared Expense
            // Determine who shares this expense
            let sharers: string[];

            if (expense.splits && Object.keys(expense.splits).length > 0) {
                // Use the splits field to determine who shares the expense
                sharers = Object.keys(expense.splits);
            } else {
                // Default: split among all participants
                sharers = users;
            }

            const numSharers = sharers.length;
            if (numSharers === 0) return; // Skip if no sharers

            // Payer paid the full amount
            balances[expense.payer] += expense.amount;

            // Calculate how much each sharer owes
            if (expense.split_type === 'unequal' && expense.splits) {
                // Unequal split by amounts
                sharers.forEach(sharer => {
                    const normalizedSharer = sharer === "Me" ? currentUser : sharer;
                    const shareAmount = expense.splits![sharer] || 0;
                    balances[normalizedSharer] -= shareAmount;
                });
            } else if (expense.split_type === 'percentage' && expense.splits) {
                // Percentage split
                sharers.forEach(sharer => {
                    const normalizedSharer = sharer === "Me" ? currentUser : sharer;
                    const percentage = expense.splits![sharer] || 0;
                    const shareAmount = (expense.amount * percentage) / 100;
                    balances[normalizedSharer] -= shareAmount;
                });
            } else {
                // Equal split (default)
                const costPerPerson = expense.amount / numSharers;
                sharers.forEach(sharer => {
                    const normalizedSharer = sharer === "Me" ? currentUser : sharer;
                    balances[normalizedSharer] -= costPerPerson;
                });
            }
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

    console.log("Final balances:", balances);
    console.log("Debtors:", debtors);
    console.log("Creditors:", creditors);
    console.log("Final debts:", debts);
    console.log("=== DEBT CALCULATION END ===");

    return debts;
}
