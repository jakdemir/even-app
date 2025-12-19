"use client";

import { Expense } from "@/types";
import { Debt } from "@/lib/debt";
import { useMemo } from "react";

interface SpendingSummaryProps {
    expenses: Expense[];
    currentUser: string;
    displayName: string | null;
    debts: Debt[];
}

export default function SpendingSummary({ expenses, currentUser, displayName, debts }: SpendingSummaryProps) {
    const stats = useMemo(() => {
        const totalSpent = expenses
            .filter(e => e.type === 'expense')
            .reduce((sum, e) => sum + (e.amount_usd || e.amount), 0);

        const userPaid = expenses
            .filter(e => e.type === 'expense' && (e.payer === currentUser || e.payer === displayName))
            .reduce((sum, e) => sum + (e.amount_usd || e.amount), 0);

        const payments = expenses
            .filter(e => e.type === 'payment')
            .reduce((sum, e) => sum + (e.amount_usd || e.amount), 0);

        const expenseCount = expenses.filter(e => e.type === 'expense').length;
        const paymentCount = expenses.filter(e => e.type === 'payment').length;

        // Calculate user's share (equal split for now)
        const participants = new Set<string>();
        expenses.forEach(e => {
            participants.add(e.payer);
            if (e.recipient) participants.add(e.recipient);
        });
        const numParticipants = Math.max(participants.size, 1);
        const userShare = totalSpent / numParticipants;

        return {
            totalSpent,
            userPaid,
            userShare,
            payments,
            expenseCount,
            paymentCount,
            balance: userPaid - userShare
        };
    }, [expenses, currentUser, displayName]);

    // Determine debt status
    const myDebt = debts.find(d => d.debtor === displayName || d.debtor === currentUser);
    const myCredit = debts.find(d => d.creditor === displayName || d.creditor === currentUser);

    let balanceText = "Settled";
    if (myDebt && displayName) {
        balanceText = `${displayName} owes ${myDebt.creditor}`;
    } else if (myCredit && displayName) {
        balanceText = `${myCredit.debtor} owes ${displayName}`;
    }

    return (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 space-y-4 border border-primary/20">
            <h3 className="font-bold text-lg">Group Summary</h3>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/80 backdrop-blur rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
                </div>

                <div className="bg-background/80 backdrop-blur rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Balance</p>
                    <p className={`text-2xl font-bold ${myCredit ? 'text-green-600' : myDebt ? 'text-red-600' : ''}`}>
                        ${(myDebt?.amount || myCredit?.amount || 0).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        {balanceText}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t border-primary/10">
                <span>📝 {stats.expenseCount} expenses</span>
            </div>
        </div>
    );
}
