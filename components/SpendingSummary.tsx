"use client";

import { Expense } from "@/types";
import { useMemo } from "react";

interface SpendingSummaryProps {
    expenses: Expense[];
    currentUser: string;
    displayName: string | null;
}

export default function SpendingSummary({ expenses, currentUser, displayName }: SpendingSummaryProps) {
    const stats = useMemo(() => {
        const totalSpent = expenses
            .filter(e => e.type === 'expense')
            .reduce((sum, e) => sum + e.amount, 0);

        const youPaid = expenses
            .filter(e => e.type === 'expense' && (e.payer === currentUser || e.payer === displayName))
            .reduce((sum, e) => sum + e.amount, 0);

        const payments = expenses
            .filter(e => e.type === 'payment')
            .reduce((sum, e) => sum + e.amount, 0);

        const expenseCount = expenses.filter(e => e.type === 'expense').length;
        const paymentCount = expenses.filter(e => e.type === 'payment').length;

        // Calculate your share (equal split for now)
        const participants = new Set<string>();
        expenses.forEach(e => {
            participants.add(e.payer);
            if (e.recipient) participants.add(e.recipient);
        });
        const numParticipants = Math.max(participants.size, 1);
        const yourShare = totalSpent / numParticipants;

        return {
            totalSpent,
            youPaid,
            yourShare,
            payments,
            expenseCount,
            paymentCount,
            balance: youPaid - yourShare
        };
    }, [expenses, currentUser, displayName]);

    return (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 space-y-4 border border-primary/20">
            <h3 className="font-bold text-lg">Group Summary</h3>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/80 backdrop-blur rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                    <p className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
                </div>

                <div className="bg-background/80 backdrop-blur rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Your Share</p>
                    <p className="text-2xl font-bold">${stats.yourShare.toFixed(2)}</p>
                </div>

                <div className="bg-background/80 backdrop-blur rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">You Paid</p>
                    <p className="text-2xl font-bold text-primary">${stats.youPaid.toFixed(2)}</p>
                </div>

                <div className="bg-background/80 backdrop-blur rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Balance</p>
                    <p className={`text-2xl font-bold ${stats.balance > 0 ? 'text-green-600' : stats.balance < 0 ? 'text-red-600' : ''}`}>
                        ${Math.abs(stats.balance).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        {stats.balance > 0 ? 'You are owed' : stats.balance < 0 ? 'You owe' : 'Settled'}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground pt-2 border-t border-primary/10">
                <span>📝 {stats.expenseCount} expenses</span>
                <span>💸 {stats.paymentCount} payments</span>
            </div>
        </div>
    );
}
