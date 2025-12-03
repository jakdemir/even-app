"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Expense } from "@/types";

interface AddExpenseFormProps {
    onAdd: (expense: Omit<Expense, "id" | "date" | "group_id">) => void;
    participants?: string[];
    className?: string;
    initialData?: Expense;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AddExpenseForm({ onAdd, participants = [], className, initialData, isOpen: controlledIsOpen, onClose }: AddExpenseFormProps) {
    const [description, setDescription] = useState(initialData?.description || "");
    const [amount, setAmount] = useState(initialData?.amount.toString() || "");
    const [payer, setPayer] = useState(initialData?.payer || "Me");
    const [splitType, setSplitType] = useState<'equal' | 'unequal' | 'percentage'>(initialData?.split_type || 'equal');
    const [currency, setCurrency] = useState(initialData?.currency || 'USD');
    const [isRecurring, setIsRecurring] = useState(initialData?.is_recurring || false);
    const [recurrencePattern, setRecurrencePattern] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(initialData?.recurrence_pattern || 'monthly');
    const [customSplits, setCustomSplits] = useState<Record<string, string>>(initialData?.splits ? Object.fromEntries(Object.entries(initialData.splits).map(([k, v]) => [k, v.toString()])) : {});
    const [isCustomPayer, setIsCustomPayer] = useState(false);
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = (open: boolean) => {
        if (controlledIsOpen !== undefined) {
            onClose?.();
        } else {
            setInternalIsOpen(open);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;

        const expenseData: Omit<Expense, "id" | "date" | "group_id"> = {
            description,
            amount: parseFloat(amount),
            payer,
            type: initialData?.type || 'expense',
            split_type: splitType,
            currency,
        };

        if (splitType !== 'equal' && Object.keys(customSplits).length > 0) {
            expenseData.splits = Object.fromEntries(
                Object.entries(customSplits).map(([k, v]) => [k, parseFloat(v) || 0])
            );
        }

        if (isRecurring) {
            expenseData.is_recurring = true;
            expenseData.recurrence_pattern = recurrencePattern;
        }

        onAdd(expenseData);

        if (!initialData) {
            setDescription("");
            setAmount("");
            setPayer("Me");
            setSplitType('equal');
            setCurrency('USD');
            setIsRecurring(false);
            setCustomSplits({});
            setIsCustomPayer(false);
        }
        setIsOpen(false);
    };

    // Ensure "Me" is always first, then unique sorted participants
    const uniqueParticipants = Array.from(new Set(["Me", ...participants])).filter(p => p !== "Me").sort();

    // If controlled by parent (isOpen prop provided), don't show the floating button
    if (controlledIsOpen !== undefined && !isOpen) {
        return null;
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center text-3xl hover:scale-105 active:scale-95 transition-all",
                    className
                )}
            >
                +
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-background w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl">{initialData ? "Edit Expense" : "New Expense"}</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is it for?"
                            autoFocus
                            className="w-full p-4 bg-secondary/30 rounded-2xl text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
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

                    {/* Currency Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Currency</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full p-3 bg-secondary/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="WLD">WLD</option>
                            <option value="USDC">USDC</option>
                        </select>
                    </div>

                    {/* Split Type Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Split Type</label>
                        <div className="flex gap-2">
                            {(['equal', 'unequal', 'percentage'] as const).map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSplitType(type)}
                                    className={cn(
                                        "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all",
                                        splitType === type
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "bg-secondary hover:bg-secondary/80"
                                    )}
                                >
                                    {type === 'equal' ? 'Equal' : type === 'unequal' ? 'Unequal' : 'By %'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Splits (if not equal) */}
                    {splitType !== 'equal' && (
                        <div className="space-y-2 bg-secondary/20 p-3 rounded-xl">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {splitType === 'percentage' ? 'Split Percentages' : 'Split Amounts'}
                            </label>
                            {uniqueParticipants.map(p => (
                                <div key={p} className="flex items-center gap-2">
                                    <span className="text-sm flex-1">{p}</span>
                                    <input
                                        type="number"
                                        value={customSplits[p] || ''}
                                        onChange={(e) => setCustomSplits({ ...customSplits, [p]: e.target.value })}
                                        placeholder={splitType === 'percentage' ? '0' : '0.00'}
                                        step={splitType === 'percentage' ? '1' : '0.01'}
                                        className="w-24 p-2 bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <span className="text-xs text-muted-foreground">{splitType === 'percentage' ? '%' : '$'}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recurring Expense Toggle */}
                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl">
                        <label className="text-sm font-medium">Recurring Expense</label>
                        <button
                            type="button"
                            onClick={() => setIsRecurring(!isRecurring)}
                            className={cn(
                                "w-12 h-6 rounded-full transition-all relative",
                                isRecurring ? "bg-primary" : "bg-secondary"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all",
                                isRecurring ? "left-6" : "left-0.5"
                            )} />
                        </button>
                    </div>

                    {/* Recurrence Pattern (if recurring) */}
                    {isRecurring && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Repeat</label>
                            <select
                                value={recurrencePattern}
                                onChange={(e) => setRecurrencePattern(e.target.value as any)}
                                className="w-full p-3 bg-secondary/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paid By</label>
                        <div className="flex flex-wrap gap-2">
                            {uniqueParticipants.map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => { setPayer(p); setIsCustomPayer(false); }}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                        payer === p && !isCustomPayer
                                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                                            : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                    )}
                                >
                                    {p === "Me" ? "Me" : p}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => { setIsCustomPayer(true); setPayer(""); }}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    isCustomPayer
                                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                                        : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                )}
                            >
                                Other...
                            </button>
                        </div>

                        {isCustomPayer && (
                            <input
                                type="text"
                                value={payer}
                                onChange={(e) => setPayer(e.target.value)}
                                placeholder="Enter name..."
                                className="w-full mt-2 p-3 bg-secondary/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 animate-in fade-in slide-in-from-top-2"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all hover:brightness-110 mt-4"
                    >
                        {initialData ? "Save Changes" : "Add Expense"}
                    </button>
                </form>
            </div>
        </div>
    );
}
