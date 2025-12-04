"use client";

import { useState, useEffect } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";
import ExpenseCard from "@/components/ExpenseCard";
import AddExpenseForm from "@/components/AddExpenseForm";
import AuthButton from "@/components/AuthButton";
import SettleUpButton from "@/components/SettleUpButton";
import JoinGroupForm from "@/components/JoinGroupForm";
import GroupList from "@/components/GroupList";
import SetUsernameForm from "@/components/SetUsernameForm";
import ShareButton from "@/components/ShareButton";
import GroupSettings from "@/components/GroupSettings";
import SpendingSummary from "@/components/SpendingSummary";
import RecordPaymentModal from "@/components/RecordPaymentModal";
import { calculateDebts } from "@/lib/debt";
import { cn } from "@/lib/utils";
import { Expense } from "@/types";

export default function Home() {
  const { expenses, addExpense, currentUser, login, isLoading, groupId, joinGroup, leaveGroup, displayName, updateDisplayName, participants, groups, clearExpenses } = useExpenses();
  const isAuthenticated = !!currentUser;
  const [debts, setDebts] = useState<import("@/lib/debt").Debt[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Handle invite link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteGroupId = params.get('invite');

    if (inviteGroupId && currentUser && displayName && !groupId) {
      console.log("Auto-joining group from invite:", inviteGroupId);
      joinGroup(inviteGroupId);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [currentUser, displayName, groupId, joinGroup]);

  useEffect(() => {
    // We use displayName as the identifier for "Me" in expenses if it exists
    const myIdentifier = displayName || currentUser;
    if (expenses.length > 0 && myIdentifier) {
      setDebts(calculateDebts(expenses, myIdentifier));
    } else {
      setDebts([]);
    }
  }, [expenses, currentUser, displayName]);

  const handleLoginSuccess = (address: string, username?: string) => {
    console.log("Login success, address:", address, "username:", username);
    login(address, username);
  };

  const handleAddExpense = (expense: Omit<Expense, "id" | "date" | "group_id">) => {
    // If payer is "Me", replace with displayName
    const payer = expense.payer === "Me" && displayName ? displayName : (expense.payer === "Me" ? (currentUser || "Me") : expense.payer);

    // Replace "Me" in splits with displayName
    let splits = expense.splits;
    if (splits && displayName) {
      const newSplits: Record<string, number> = {};
      Object.entries(splits).forEach(([key, value]) => {
        const newKey = key === "Me" ? displayName : key;
        newSplits[newKey] = value;
      });
      splits = newSplits;
    }

    addExpense({ ...expense, payer, splits });
  };

  const handleRecordPayment = (payment: Omit<Expense, "id" | "date" | "group_id">) => {
    // Normalize payer/recipient if "Me" is selected
    const payer = payment.payer === "Me" && displayName ? displayName : (payment.payer === "Me" ? (currentUser || "Me") : payment.payer);
    const recipient = payment.recipient === "Me" && displayName ? displayName : (payment.recipient === "Me" ? (currentUser || "Me") : payment.recipient);

    addExpense({ ...payment, payer, recipient });
    setIsPaymentModalOpen(false);
  };

  // Find current group name
  const currentGroup = groups.find(g => g.id === groupId);

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-pulse text-lg font-medium">Loading expenses...</div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Even</h1>
          <p className="text-muted-foreground">Split expenses with friends on World App.</p>
        </div>
        <AuthButton onSuccess={handleLoginSuccess} />
      </main>
    );
  }

  if (!displayName) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-pulse text-lg font-medium">Setting up profile...</div>
      </main>
    );
  }

  if (!groupId) {
    return (
      <main className="min-h-screen flex flex-col p-6 space-y-8 max-w-md mx-auto">
        <header className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Even</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{displayName}</span>
            <button
              onClick={clearExpenses}
              className="text-xs text-muted-foreground hover:text-primary underline"
            >
              Logout
            </button>
          </div>
        </header>
        <GroupList />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={leaveGroup}
            className="text-xs font-medium text-muted-foreground hover:text-primary mb-1 flex items-center gap-1 transition-colors"
          >
            ← My Groups
          </button>
          <h1 className="text-2xl font-bold tracking-tight">{currentGroup?.name || "Even"}</h1>
          <div className="flex items-center gap-2 mt-1">
            <ShareButton groupId={groupId!} />
            <GroupSettings groupId={groupId!} groupName={currentGroup?.name || "Group"} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">{displayName}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            👤
          </div>
        </div>
      </header>

      {/* Spending Summary */}
      <SpendingSummary expenses={expenses} currentUser={currentUser!} displayName={displayName} debts={debts} />

      {/* Settlement Plan (Debts) */}
      <div className="mb-6 grid gap-3">
        {debts.length > 0 ? (
          debts.map((debt, i) => {
            const isMeDebtor = debt.debtor === currentUser || debt.debtor === displayName;
            const isMeCreditor = debt.creditor === currentUser || debt.creditor === displayName;

            // Get display names for debtor and creditor
            const debtorName = debt.debtor.length > 20 ? debt.debtor.slice(0, 8) + "..." : debt.debtor;
            const creditorName = debt.creditor.length > 20 ? debt.creditor.slice(0, 8) + "..." : debt.creditor;

            return (
              <div key={i} className={cn(
                "p-4 rounded-xl border flex items-center justify-between",
                isMeDebtor ? "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/50" :
                  isMeCreditor ? "bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-900/50" :
                    "bg-card"
              )}>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {debtorName} owes {creditorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <span className={cn(
                  "text-lg font-bold",
                  isMeDebtor ? "text-red-600" : isMeCreditor ? "text-green-600" : ""
                )}>
                  ${debt.amount.toFixed(2)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="p-4 rounded-xl bg-secondary/50 text-center text-muted-foreground text-sm">
            All settled up! 🎉
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <SettleUpButton
          amount={debts.find(d => d.debtor === currentUser || d.debtor === displayName)?.amount || 0}
          recipient={debts.find(d => d.debtor === currentUser || d.debtor === displayName)?.creditor || ""}
          disabled={!debts.some(d => d.debtor === currentUser || d.debtor === displayName)}
        />
        <button
          className="flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-secondary-foreground font-semibold rounded-xl active:scale-95 transition-all"
          onClick={() => setIsPaymentModalOpen(true)}
        >
          💸 Record Payment
        </button>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Recent Expenses</h2>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-xl border-dashed border-2">
            No expenses yet. Add one!
          </div>
        ) : (
          expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              isMe={expense.payer === currentUser || expense.payer === displayName}
            />
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <AddExpenseForm onAdd={handleAddExpense} participants={participants} currentUserName={displayName || undefined} />
      </div>

      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onRecord={handleRecordPayment}
        participants={participants}
        currentUserName={displayName || undefined}
      />
    </main>
  );
}
