import { Expense } from "@/types";
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
    expense: Expense;
    className?: string;
}

export default function ExpenseCard({ expense, className }: ExpenseCardProps) {
    const isPayment = expense.type === 'payment';

    return (
        <div className={cn("flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm", className)}>
            <div className="flex flex-col">
                <span className={cn("font-medium", isPayment ? "text-primary italic" : "text-foreground")}>
                    {expense.description}
                </span>
                <span className="text-sm text-muted-foreground">
                    {isPayment ? `From ${expense.payer}` : `Paid by ${expense.payer}`}
                </span>
            </div>
            <div className="flex flex-col items-end">
                <span className={cn("font-bold", isPayment ? "text-primary" : "text-foreground")}>
                    ${expense.amount.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
