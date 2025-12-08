import { useState } from "react";
import { Expense } from "@/types";
import { cn } from "@/lib/utils";
import { useExpenses } from "@/contexts/ExpenseContext";
import AddExpenseForm from "./AddExpenseForm";

interface ExpenseCardProps {
    expense: Expense;
    isMe?: boolean;
}

export default function ExpenseCard({ expense, isMe }: ExpenseCardProps) {
    const isPayment = expense.type === 'payment';
    const { updateExpense, deleteExpense, participants, displayName } = useExpenses();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleUpdate = async (updatedData: Omit<Expense, "id" | "date" | "group_id">) => {
        await updateExpense({
            ...expense,
            ...updatedData
        });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        await deleteExpense(expense.id);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all group relative",
                isPayment ? "bg-primary/5" : "bg-secondary/30 hover:bg-secondary/50"
            )}>
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-lg",
                        isPayment ? "bg-primary/10 text-primary" : "bg-background text-foreground shadow-sm"
                    )}>
                        {isPayment ? "💸" : "🧾"}
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("font-semibold text-sm", isPayment ? "text-primary" : "text-foreground")}>
                            {expense.description}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {isPayment ? "Payment" : `Paid by ${expense.payer}`}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                        "font-bold text-base",
                        isPayment ? "text-primary" : "text-foreground"
                    )}>
                        ${expense.amount.toFixed(2)}
                    </span>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground font-medium">
                            Recorded by {expense.payer}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            {new Date(expense.date).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </span>
                    </div>
                    {displayName === expense.payer && (
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-xs text-blue-500 hover:underline font-medium"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-xs text-red-500 hover:underline font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AddExpenseForm
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onAdd={handleUpdate}
                initialData={expense}
                participants={participants}
                currentUserName={displayName || undefined}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-background w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                        <h3 className="font-bold text-xl mb-2">Delete Expense?</h3>
                        <p className="text-muted-foreground mb-6">
                            Delete "{expense.description}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl active:scale-95 transition-all hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
