"use client";

import { useState, useEffect, useRef } from "react";
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
import Footer from "@/components/Footer";
import { calculateDebts } from "@/lib/debt";
import { cn } from "@/lib/utils";
import { Expense } from "@/types";

export default function Home() {
  const { expenses, addExpense, currentUser, login, isLoading, groupId, joinGroup, leaveGroup, displayName, updateDisplayName, participants, groups, clearExpenses, refreshExpenses, userWallets } = useExpenses();
  const isAuthenticated = !!currentUser;
  const [debts, setDebts] = useState<import("@/lib/debt").Debt[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isJoiningFromInvite, setIsJoiningFromInvite] = useState(false);

  // Pull-to-refresh state
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = useRef(0);
  const mainRef = useRef<HTMLElement>(null);

  // Early detection of invite parameter - store in localStorage before auth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteGroupId = params.get('invite');

    if (inviteGroupId) {
      console.log("Invite detected, storing in localStorage:", inviteGroupId);
      localStorage.setItem('even_pending_invite', inviteGroupId);
      // Clean up URL immediately
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []); // Run only once on mount

  // Handle invite link - attempt to join when user is authenticated and has display name
  useEffect(() => {
    const pendingInvite = localStorage.getItem('even_pending_invite');

    // Only proceed if we have a pending invite, user is authenticated with display name, and not already in a group
    if (pendingInvite && currentUser && displayName && !groupId && !isJoiningFromInvite) {
      console.log("Attempting to auto-join group from invite:", pendingInvite);
      setIsJoiningFromInvite(true);
      setInviteError(null);

      joinGroup(pendingInvite)
        .then((success) => {
          if (success) {
            console.log("Successfully joined group from invite");
            localStorage.removeItem('even_pending_invite');
          } else {
            console.error("Failed to join group from invite");
            setInviteError("Unable to join group. The invite link may be invalid or expired.");
            localStorage.removeItem('even_pending_invite');
          }
        })
        .catch((error) => {
          console.error("Error joining group from invite:", error);
          setInviteError("An error occurred while joining the group.");
          localStorage.removeItem('even_pending_invite');
        })
        .finally(() => {
          setIsJoiningFromInvite(false);
        });
    }
  }, [currentUser, displayName, groupId, joinGroup, isJoiningFromInvite]);

  useEffect(() => {
    // We use displayName as the identifier for "Me" in expenses if it exists
    const myIdentifier = displayName || currentUser;
    if (expenses.length > 0 && myIdentifier) {
      setDebts(calculateDebts(expenses, myIdentifier));
    } else {
      setDebts([]);
    }
  }, [expenses, currentUser, displayName]);

  // Pull-to-refresh with native event listeners (passive: false to allow preventDefault)
  useEffect(() => {
    if (!groupId || !mainRef.current) return;

    const element = mainRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      console.log('👆 [TOUCH START] scrollTop:', scrollTop);
      if (scrollTop === 0) {
        pullStartY.current = e.touches[0].clientY;
        console.log('👆 [TOUCH START] Set startY:', e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (pullStartY.current === 0) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollTop > 0) {
        console.log('👆 [TOUCH MOVE] Scrolled down, resetting');
        pullStartY.current = 0;
        return;
      }

      const currentY = e.touches[0].clientY;
      const distance = currentY - pullStartY.current;

      if (distance > 0) {
        console.log('👆 [TOUCH MOVE] Pull distance:', distance);
        // Prevent default pull-to-refresh behavior
        e.preventDefault();
        setIsPulling(true);
        setPullDistance(Math.min(distance, 100));
      }
    };

    const handleTouchEnd = async () => {
      console.log('👆 [TOUCH END] Pull distance:', pullDistance);
      if (pullDistance > 60) {
        console.log('🔄 [TOUCH END] Triggering refresh...');
        await refreshExpenses();
      }
      setIsPulling(false);
      setPullDistance(0);
      pullStartY.current = 0;
    };

    // Add event listeners with passive: false to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [groupId, pullDistance, refreshExpenses]);

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

  const handleRecordPayment = (payment: Omit<Expense, "id" | "date" | "group_id">, cryptoMetadata?: { wldAmount: number; exchangeRate: number; token: string }) => {
    // Normalize payer/recipient if "Me" is selected
    const payer = payment.payer === "Me" && displayName ? displayName : (payment.payer === "Me" ? (currentUser || "Me") : payment.payer);
    const recipient = payment.recipient === "Me" && displayName ? displayName : (payment.recipient === "Me" ? (currentUser || "Me") : payment.recipient);

    // Include crypto payment metadata if provided
    const paymentData = cryptoMetadata ? {
      ...payment,
      payer,
      recipient,
      payment_token: cryptoMetadata.token,
      payment_token_amount: cryptoMetadata.wldAmount,
      payment_exchange_rate: cryptoMetadata.exchangeRate
    } : { ...payment, payer, recipient };

    addExpense(paymentData);
    setIsPaymentModalOpen(false);
  };

  // Find current group name
  const currentGroup = groups.find(g => g.id === groupId);

  if (isLoading || isJoiningFromInvite) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-pulse text-lg font-medium">
          {isJoiningFromInvite ? "Joining group..." : "Loading expenses..."}
        </div>
      </main>
    );
  }

  // Show verifying state if we have a user but no display name yet (transitioning)
  if (currentUser && !displayName) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-pulse text-lg font-medium">Verifying identity...</div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <>
        <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2">Even</h1>
            <p className="text-muted-foreground">Split expenses with friends on World App.</p>
          </div>
          <AuthButton onSuccess={handleLoginSuccess} />
        </main>
        <Footer />
      </>
    );
  }

  if (!groupId) {
    return (
      <>
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
          {inviteError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50">
              <p className="text-sm text-red-600 dark:text-red-400">{inviteError}</p>
              <button
                onClick={() => setInviteError(null)}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline mt-2"
              >
                Dismiss
              </button>
            </div>
          )}
          <GroupList />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <main
      ref={mainRef}
      className="min-h-screen flex flex-col p-4 max-w-md mx-auto pb-24"
    >
      {/* Pull-to-refresh indicator */}
      {isPulling && (
        <div
          className="fixed top-0 left-0 right-0 flex justify-center items-center z-50 transition-all"
          style={{
            height: `${pullDistance}px`,
            opacity: pullDistance / 100
          }}
        >
          <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
            {pullDistance > 60 ? '↻' : '↓'}
          </div>
        </div>
      )}

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

      {/* Group Members Section */}
      <div className="mb-6 p-4 rounded-xl bg-secondary/30 border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Group Members ({participants.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {participants.map(member => (
            <div
              key={member}
              className="px-3 py-1.5 bg-background rounded-full text-sm font-medium border shadow-sm"
            >
              {member === displayName ? `${member} (You)` : member}
            </div>
          ))}
        </div>
      </div>

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
        {(() => {
          const myDebt = debts.find(d => d.debtor === currentUser || d.debtor === displayName);
          const creditorName = myDebt?.creditor || "";
          const creditorWallet = userWallets[creditorName] || "";

          console.log('💰 [SETTLE UP BUTTON] Debt info:', {
            myDebt,
            creditorName,
            creditorWallet,
            userWallets
          });

          return (
            <SettleUpButton
              suggestedAmount={myDebt?.amount || 0}
              recipient={creditorWallet}
              recipientName={creditorName}
              disabled={!myDebt || !creditorWallet}
              onPaymentSuccess={(metadata) => {
                // Record the payment with crypto metadata
                if (metadata && myDebt) {
                  handleRecordPayment({
                    description: `Payment to ${creditorName}`,
                    amount: myDebt.amount,
                    payer: displayName || currentUser || '',
                    recipient: creditorName,
                    type: 'payment'
                  }, metadata);
                }
                refreshExpenses();
              }}
            />
          );
        })()}
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
