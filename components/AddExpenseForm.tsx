"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Expense } from "@/types";

interface AddExpenseFormProps {
    onAdd: (expense: Omit<Expense, "id" | "date">) => void;
    className?: string;
}

export default function AddExpenseForm({ onAdd, className }: AddExpenseFormProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [payer, setPayer] = useState("Me"); // Default to "Me" for MVP

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;

        onAdd({
            description,
            amount: parseFloat(amount),
            payer,
            type: 'expense',
        });

        setDescription("");
        setAmount("");
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-4 p-4 bg-card rounded-xl border shadow-sm", className)}>
            <h3 className="font-semibold text-lg">Add New Expense</h3>

            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Dinner, Uber, etc."
                    className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Paid by</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setPayer("Me")}
                        className={cn(
                            "flex-1 py-2 rounded-lg border transition-all font-medium",
                            payer === "Me"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted"
                        )}
                    >
                        Me
                    </button>
                    <button
                        type="button"
                        onClick={() => setPayer("Friend")}
                        className={cn(
                            "flex-1 py-2 rounded-lg border transition-all font-medium",
                            payer === "Friend"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted"
                        )}
                    >
                        Friend
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full p-3 pl-8 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl active:scale-95 transition-all"
            >
                Add Expense
            </button>
        </form>
    );
}
