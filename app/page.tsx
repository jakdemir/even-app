"use client";
import { useState } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";
import ExpenseCard from "@/components/ExpenseCard";
import AddExpenseForm from "@/components/AddExpenseForm";
import SettleUpButton from "@/components/SettleUpButton";
import AuthButton from "@/components/AuthButton";
import { Expense } from "@/types";

import JoinGroupForm from "@/components/JoinGroupForm";

export default function Home() {
  const { expenses, addExpense, currentUser, login, isLoading, groupId, joinGroup } = useExpenses();
  const isAuthenticated = !!currentUser;
  const [recipientAddress, setRecipientAddress] = useState("");

  const handleLoginSuccess = (address: string) => {
    console.log("Login success, address:", address);
    login(address);
  };

  const handleAddExpense = (expense: Omit<Expense, "id" | "date" | "group_id">) => {
    // If payer is "Me", replace with currentUser address if available
    const payer = expense.payer === "Me" && currentUser ? currentUser : expense.payer;
    addExpense({ ...expense, payer });
  };

  // Simple logic: I owe half of what others paid, others owe half of what I paid.
  // Net balance = (My payments / 2) - (Others payments / 2)
  // If positive, I am owed. If negative, I owe.

  // NOTE: In a real app, "Me" should be the currentUser address.
  // But for MVP, the mock data uses "Me". 
  // We should align this. Let's assume currentUser is "Me" for calculation purposes 
  // if the payer string matches, OR if we want to be robust, we should store payer as address.
  // For now, let's keep the string "Me" for the user's own expenses in the UI form, 
  // or map the address to "Me".

  // Let's update the calculation to check against currentUser OR "Me" (legacy mock).
  const isMe = (payer: string) => payer === "Me" || payer === currentUser;

  let netBalance = 0;
  expenses.forEach(e => {
    const amIPayer = isMe(e.payer);
    // Default to 'expense' if type is missing (backward compatibility)
    const type = e.type || 'expense';

    if (type === 'payment') {
      // Payment: 100% transfer
      // If I paid, I get credit (+). If I received (someone else paid), I get debit (-).
      // Wait, if someone else paid "Me", then they paid me.
      // But here "payer" is the one who sent money.
      // So if I am payer, I sent money. My debt decreases (or credit increases).
      // If I am NOT payer, someone sent money. To whom?
      // We assume payments are between the two parties involved in the balance.
      // Since this is a simple view, we assume if I didn't pay, it was paid TO me.
      if (amIPayer) netBalance += e.amount;
      else netBalance -= e.amount;
    } else {
      // Expense: 50/50 split
      if (amIPayer) netBalance += e.amount / 2;
      else netBalance -= e.amount / 2;
    }
  });

  const isOwed = netBalance >= 0;

  const handlePaymentSuccess = () => {
    addExpense({
      description: "Payment",
      amount: Math.abs(netBalance),
      payer: currentUser || "Me",
      type: 'payment'
    });
    setRecipientAddress("");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-pulse text-lg font-medium">Loading expenses...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
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

  if (!groupId) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 max-w-md mx-auto">
        <header className="w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Even</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              {currentUser?.slice(0, 6)}...{currentUser?.slice(-4)}
            </span>
          </div>
        </header>
        <JoinGroupForm onJoin={joinGroup} />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pb-20 space-y-6 max-w-md mx-auto">
      <header className="flex items-center justify-between py-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">Even</h1>
          <span className="text-xs text-muted-foreground">Group: {groupId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {currentUser?.slice(0, 6)}...{currentUser?.slice(-4)}
          </span>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold">JD</span>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <section className="p-6 bg-primary text-primary-foreground rounded-2xl shadow-lg">
        <span className="text-sm opacity-80">{isOwed ? "You are owed" : "You owe"}</span>
        <div className="text-4xl font-bold mt-1 mb-4">
          ${Math.abs(netBalance).toFixed(2)}
        </div>
        {!isOwed && (
          <div className="space-y-3 mt-4">
            <input
              type="text"
              placeholder="Recipient Address (0x...)"
              className="w-full p-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
            <SettleUpButton
              amount={Math.abs(netBalance)}
              recipientAddress={recipientAddress}
              className="bg-white text-black hover:bg-gray-100"
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        )}
      </section>

      {/* Actions */}
      <section>
        <AddExpenseForm onAdd={handleAddExpense} />
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No expenses yet.</p>
          ) : (
            expenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
