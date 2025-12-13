"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Expense } from "@/types";

interface AddExpenseFormProps {
    onAdd: (expense: Omit<Expense, "id" | "date" | "group_id">) => void;
    participants?: string[];
    currentUserName?: string;
    className?: string;
    initialData?: Expense;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function AddExpenseForm({ onAdd, participants = [], currentUserName = "Me", className, initialData, isOpen: controlledIsOpen, onClose }: AddExpenseFormProps) {
    const [description, setDescription] = useState(initialData?.description || "");
    const [amount, setAmount] = useState(initialData?.amount.toString() || "");
    const [payer, setPayer] = useState(initialData?.payer || currentUserName);
    const [splitType, setSplitType] = useState<'equal' | 'unequal' | 'percentage'>(initialData?.split_type || 'equal');
    const [customSplits, setCustomSplits] = useState<Record<string, string>>(initialData?.splits ? Object.fromEntries(Object.entries(initialData.splits).map(([k, v]) => [k, v.toString()])) : {});
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    // Initialize with all participants selected by default
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

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

        // Validate amount is a valid number
        const parsedAmount = parseFloat(amount);
        if (!amount || parseFloat(amount) <= 0) {
            return;
        }

        const expenseData: Omit<Expense, "id" | "date" | "group_id"> = {
            description,
            amount: parsedAmount,
            payer,
            type: initialData?.type || 'expense',
            split_type: splitType,
            currency: 'USD',
        };

        // Determine who shares this expense
        const participantsToSplit = selectedParticipants.length > 0 ? selectedParticipants : uniqueParticipants;

        if (splitType === 'unequal' && Object.keys(customSplits).length > 0) {
            // For unequal split, use the custom splits (amounts)
            expenseData.splits = Object.fromEntries(
                Object.entries(customSplits).map(([k, v]) => [k, parseFloat(v) || 0])
            );
        } else if (splitType === 'percentage' && Object.keys(customSplits).length > 0) {
            // For percentage split, use the custom splits (percentages)
            expenseData.splits = Object.fromEntries(
                Object.entries(customSplits).map(([k, v]) => [k, parseFloat(v) || 0])
            );
        } else {
            // For equal split (or fallback), store participants with equal shares
            expenseData.splits = Object.fromEntries(
                participantsToSplit.map(p => [p, parsedAmount / participantsToSplit.length])
            );
        }

        onAdd(expenseData);

        if (!initialData) {
            setDescription("");
            setAmount("");
            setPayer(currentUserName);
            setSplitType('equal');
            setCustomSplits({});
            setSelectedParticipants([]);
        }
        setIsOpen(false);
    };

    // Ensure current user is always first, then unique sorted participants
    const uniqueParticipants = [currentUserName, ...Array.from(new Set(participants)).filter(p => p !== currentUserName).sort()];

    // Initialize selectedParticipants with all participants when modal opens
    useEffect(() => {
        if (isOpen && selectedParticipants.length === 0) {
            setSelectedParticipants(uniqueParticipants);
        }
    }, [isOpen, uniqueParticipants.length]);

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
                                type="text"
                                inputMode="decimal"
                                pattern="[0-9]*\.?[0-9]*"
                                value={amount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow numbers and decimal point
                                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                        setAmount(value);
                                    }
                                }}
                                placeholder="0.00"
                                className="w-full p-4 pl-10 bg-secondary/30 rounded-2xl text-2xl font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Paid By */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paid By</label>
                        <div className="flex flex-wrap gap-2">
                            {uniqueParticipants.map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPayer(p)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                        payer === p
                                            ? "bg-primary text-primary-foreground shadow-md scale-105"
                                            : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Paid For - Who shares this expense (Checkboxes) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paid For</label>
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedParticipants.length === uniqueParticipants.length) {
                                        setSelectedParticipants([]);
                                    } else {
                                        setSelectedParticipants(uniqueParticipants);
                                    }
                                }}
                                className="text-xs text-primary hover:underline"
                            >
                                {selectedParticipants.length === uniqueParticipants.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="space-y-2 bg-secondary/20 p-3 rounded-xl">
                            {uniqueParticipants.map(p => (
                                <label
                                    key={p}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-secondary/30 p-2 rounded-lg transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedParticipants.includes(p)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedParticipants([...selectedParticipants, p]);
                                            } else {
                                                setSelectedParticipants(selectedParticipants.filter(x => x !== p));
                                            }
                                        }}
                                        className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <span className="text-sm font-medium">{p}</span>
                                </label>
                            ))}
                        </div>
                        {selectedParticipants.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                Split among {selectedParticipants.length} {selectedParticipants.length === 1 ? 'person' : 'people'}
                            </p>
                        )}
                    </div>

                    {/* Split Type Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Split Type</label>
                        <div className="flex gap-2">
                            {(['equal', 'unequal', 'percentage'] as const).map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    disabled={type !== 'equal'}
                                    onClick={() => setSplitType(type)}
                                    className={cn(
                                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize",
                                        splitType === type
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                                        type !== 'equal' && "opacity-50 cursor-not-allowed hover:bg-secondary"
                                    )}
                                >
                                    {type === 'percentage' ? 'By %' : type}
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
                            {(selectedParticipants.length > 0 ? selectedParticipants : uniqueParticipants).map(p => (
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
