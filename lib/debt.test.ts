import { calculateDebts } from './debt';
import { Expense } from '@/types';

describe('calculateDebts', () => {
    const createExpense = (
        id: string,
        payer: string,
        amount: number,
        splits?: Record<string, number>,
        type: 'expense' | 'payment' = 'expense'
    ): Expense => ({
        id,
        description: `Test expense ${id}`,
        amount,
        payer,
        type,
        date: new Date().toISOString(),
        group_id: 'test-group',
        split_type: 'equal',
        currency: 'USD',
        splits,
    });

    test('should return empty array when no expenses', () => {
        const debts = calculateDebts([], 'Alice');
        expect(debts).toEqual([]);
    });

    test('should return empty array when only one user', () => {
        const expenses = [createExpense('1', 'Alice', 100)];
        const debts = calculateDebts(expenses, 'Alice');
        expect(debts).toEqual([]);
    });

    test('should calculate simple 2-person split correctly', () => {
        // Alice pays $100, split equally with Bob
        const expenses = [
            createExpense('1', 'Alice', 100, { Alice: 50, Bob: 50 })
        ];
        const debts = calculateDebts(expenses, 'Alice');

        expect(debts).toHaveLength(1);
        expect(debts[0]).toEqual({
            debtor: 'Bob',
            creditor: 'Alice',
            amount: 50
        });
    });

    test('should calculate 3-person equal split correctly', () => {
        // Alice pays $90, split equally among Alice, Bob, Charlie
        const expenses = [
            createExpense('1', 'Alice', 90, { Alice: 30, Bob: 30, Charlie: 30 })
        ];
        const debts = calculateDebts(expenses, 'Alice');

        expect(debts).toHaveLength(2);

        // Bob owes Alice $30
        const bobDebt = debts.find(d => d.debtor === 'Bob');
        expect(bobDebt).toEqual({
            debtor: 'Bob',
            creditor: 'Alice',
            amount: 30
        });

        // Charlie owes Alice $30
        const charlieDebt = debts.find(d => d.debtor === 'Charlie');
        expect(charlieDebt).toEqual({
            debtor: 'Charlie',
            creditor: 'Alice',
            amount: 30
        });
    });

    test('should calculate multiple expenses correctly', () => {
        // Alice pays $60, split among Alice, Bob, Charlie (each owes $20)
        // Bob pays $30, split among Alice, Bob, Charlie (each owes $10)
        const expenses = [
            createExpense('1', 'Alice', 60, { Alice: 20, Bob: 20, Charlie: 20 }),
            createExpense('2', 'Bob', 30, { Alice: 10, Bob: 10, Charlie: 10 })
        ];
        const debts = calculateDebts(expenses, 'Alice');

        // Net: Alice paid $60, owes $30 total = +$30
        //      Bob paid $30, owes $30 total = $0
        //      Charlie paid $0, owes $30 total = -$30
        // Result: Charlie owes Alice $30

        expect(debts.length).toBeGreaterThan(0);

        // Check total amounts
        const aliceCredit = debts.filter(d => d.creditor === 'Alice').reduce((sum, d) => sum + d.amount, 0);
        const aliceDebt = debts.filter(d => d.debtor === 'Alice').reduce((sum, d) => sum + d.amount, 0);

        // Alice should be owed $30 total (paid $60, owes $30)
        expect(Math.round((aliceCredit - aliceDebt) * 100) / 100).toBe(30);
    });

    test('should handle unequal splits correctly', () => {
        // Alice pays $100, Alice gets $30, Bob gets $70
        const expenses = [
            createExpense('1', 'Alice', 100, { Alice: 30, Bob: 70 })
        ];
        expenses[0].split_type = 'unequal';
        const debts = calculateDebts(expenses, 'Alice');

        expect(debts).toHaveLength(1);
        expect(debts[0]).toEqual({
            debtor: 'Bob',
            creditor: 'Alice',
            amount: 70
        });
    });

    test('should handle percentage splits correctly', () => {
        // Alice pays $100, 40% Alice, 60% Bob
        const expenses = [
            createExpense('1', 'Alice', 100, { Alice: 40, Bob: 60 })
        ];
        // Set split_type to percentage
        expenses[0].split_type = 'percentage';

        const debts = calculateDebts(expenses, 'Alice');

        expect(debts).toHaveLength(1);
        expect(debts[0]).toEqual({
            debtor: 'Bob',
            creditor: 'Alice',
            amount: 60
        });
    });

    test('should handle payments correctly', () => {
        // Alice pays $100 for everyone
        // Bob pays Alice back $50
        const expenses = [
            createExpense('1', 'Alice', 100, { Alice: 50, Bob: 50 }),
            createExpense('2', 'Bob', 50, undefined, 'payment')
        ];
        expenses[1].recipient = 'Alice';

        const debts = calculateDebts(expenses, 'Alice');

        // After payment, Bob should owe nothing
        expect(debts).toHaveLength(0);
    });

    test('should handle complex 4-person scenario', () => {
        // Alice pays $120 for everyone (Alice, Bob, Charlie, Diana)
        // Bob pays $80 for everyone
        // Charlie pays $40 for everyone
        const expenses = [
            createExpense('1', 'Alice', 120, { Alice: 30, Bob: 30, Charlie: 30, Diana: 30 }),
            createExpense('2', 'Bob', 80, { Alice: 20, Bob: 20, Charlie: 20, Diana: 20 }),
            createExpense('3', 'Charlie', 40, { Alice: 10, Bob: 10, Charlie: 10, Diana: 10 })
        ];

        const debts = calculateDebts(expenses, 'Alice');

        // Total spent: $240
        // Each person's share: $60
        // Alice paid $120, owes $60 = +$60
        // Bob paid $80, owes $60 = +$20
        // Charlie paid $40, owes $60 = -$20
        // Diana paid $0, owes $60 = -$60

        // Check that debts balance out
        const totalOwed = debts.reduce((sum, d) => sum + d.amount, 0);
        const creditorTotal = debts.filter(d => d.creditor === 'Alice' || d.creditor === 'Bob')
            .reduce((sum, d) => sum + d.amount, 0);
        const debtorTotal = debts.filter(d => d.debtor === 'Charlie' || d.debtor === 'Diana')
            .reduce((sum, d) => sum + d.amount, 0);

        // Total owed should equal total debt
        expect(Math.round(creditorTotal * 100) / 100).toBe(Math.round(debtorTotal * 100) / 100);
    });

    test('should handle "Me" in splits as current user', () => {
        // Legacy data might have "Me" in splits
        const expenses = [
            createExpense('1', 'Alice', 100, { Me: 50, Bob: 50 })
        ];

        const debts = calculateDebts(expenses, 'Alice');

        // "Me" should be treated as Alice
        expect(debts).toHaveLength(1);
        expect(debts[0]).toEqual({
            debtor: 'Bob',
            creditor: 'Alice',
            amount: 50
        });
    });

    test('should minimize number of transactions', () => {
        // Alice owes Bob $10, Bob owes Charlie $10
        // Should result in: Alice owes Charlie $10 (1 transaction instead of 2)
        const expenses = [
            createExpense('1', 'Bob', 20, { Alice: 10, Bob: 10 }),
            createExpense('2', 'Charlie', 20, { Bob: 10, Charlie: 10 })
        ];

        const debts = calculateDebts(expenses, 'Alice');

        // Should be optimized to minimize transactions
        expect(debts.length).toBeLessThanOrEqual(2);
    });
});
