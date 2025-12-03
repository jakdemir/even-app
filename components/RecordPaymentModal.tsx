"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Expense } from "@/types";

interface RecordPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRecord: (payment: Omit<Expense, "id" | "date" | "group_id">) => void;
    participants: string[];
}

export default function RecordPaymentModal({ isOpen, onClose, onRecord, participants }: RecordPaymentModalProps) {
    const [payer, setPayer] = useState("Me");
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!payer || !recipient || !amount) return;

        onRecord({
            description: "Payment",
            amount: parseFloat(amount),
            payer,
            recipient,
            type: 'payment',
        });

        // Reset and close
        setAmount("");
        onClose();
    };

    if (!isOpen) return null;

    // Ensure "Me" is in the list if not already
    const allParticipants = Array.from(new Set(["Me", ...participants])).sort();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-background w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl">Record Payment</h3>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">From</label>
                            <select
                                value={payer}
                                onChange={(e) => setPayer(e.target.value)}
                                className="w-full p-3 bg-secondary/30 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {allParticipants.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">To</label>
                            <select
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full p-3 bg-secondary/30 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="" disabled>Select...</option>
                                {allParticipants.filter(p => p !== payer).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                className="w-full p-4 pl-10 bg-secondary/30 rounded-2xl text-2xl font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all hover:brightness-110 mt-4"
                    >
                        Record Payment
                    </button>
                </form>
            </div>
        </div>
    );
}
