"use client";

import { MiniKit, PayCommandInput, Tokens } from "@worldcoin/minikit-js";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SettleUpButtonProps {
    suggestedAmount?: number;
    recipient: string; // wallet address
    recipientName?: string; // display name for UI
    disabled?: boolean;
    className?: string;
    onPaymentSuccess?: () => void;
}

// Helper function to validate Ethereum address format
const isValidEthereumAddress = (address: string): boolean => {
    // Check if address matches Ethereum address format: 0x followed by 40 hex characters
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export default function SettleUpButton({ suggestedAmount = 0, recipient, recipientName, disabled, className, onPaymentSuccess }: SettleUpButtonProps) {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState(suggestedAmount > 0 ? suggestedAmount.toFixed(2) : "");
    const [selectedToken, setSelectedToken] = useState<typeof Tokens.WLD | typeof Tokens.USDC>(Tokens.WLD);

    const handleSettleUp = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (!recipient || recipient.trim() === "") {
            console.error('❌ [SETTLE UP] No recipient wallet address available');
            alert(`Cannot send payment: ${recipientName || 'Recipient'}'s wallet address is not available. Please ask them to verify their account or use 'Record Payment' to manually record the payment.`);
            setIsModalOpen(false);
            return;
        }

        // Validate wallet address format
        if (!isValidEthereumAddress(recipient)) {
            console.error('❌ [SETTLE UP] Invalid wallet address format:', recipient);
            alert(`Cannot send payment: Invalid wallet address format. Please use 'Record Payment' to manually record the payment.`);
            setIsModalOpen(false);
            return;
        }

        // Check minimum amount ($0.10)
        const amountValue = parseFloat(amount);
        if (amountValue < 0.1) {
            alert("Minimum transfer amount is $0.10 due to gas fees sponsored by World App.");
            return;
        }

        setLoading(true);

        // Check if MiniKit is available
        if (!MiniKit.isInstalled()) {
            setLoading(false);
            alert("World App MiniKit is not available. Please use 'Record Payment' to manually record the payment.");
            return;
        }

        try {
            console.log('💰 [SETTLE UP] Initiating payment:', { amount, token: selectedToken, recipient, recipientName });

            const payload: PayCommandInput = {
                reference: "settle-up-" + Date.now(),
                to: recipient,
                tokens: [
                    {
                        symbol: selectedToken,
                        token_amount: parseFloat(amount).toFixed(2),
                    },
                ],
                description: `Settle up on Even${recipientName ? ` to ${recipientName}` : ''}`,
            };

            console.log('💰 [SETTLE UP] Payment payload:', payload);

            const { finalPayload } = await MiniKit.commandsAsync.pay(payload);

            console.log('💰 [SETTLE UP] Payment response:', finalPayload);

            if (finalPayload.status === "success") {
                console.log('✅ [SETTLE UP] Payment successful');
                setIsModalOpen(false);
                onPaymentSuccess?.();
            } else {
                console.warn("⚠️ [SETTLE UP] Payment not successful:", finalPayload);
                alert("Payment was not completed. Please try again or use 'Record Payment' to manually record the payment.");
            }
        } catch (error) {
            console.error("❌ [SETTLE UP] Payment failed:", error);
            alert("Payment failed. Please try again or use 'Record Payment' to manually record the payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => {
                    if (disabled) {
                        console.warn('⚠️ [SETTLE UP] Button disabled');
                        if (!recipient) {
                            alert(`Cannot settle up: ${recipientName || 'Recipient'}'s wallet address is not available. Please use 'Record Payment' to manually record the payment.`);
                        }
                        return;
                    }
                    console.log('💰 [SETTLE UP] Opening payment modal', { recipient, recipientName });
                    setIsModalOpen(true);
                }}
                disabled={disabled}
                className={cn(
                    "flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
            >
                Settle Up
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-background w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl">Settle Up Payment</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Amount Input */}
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
                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                setAmount(value);
                                            }
                                        }}
                                        placeholder="0.00"
                                        autoFocus
                                        className="w-full p-4 pl-10 bg-secondary/30 rounded-2xl text-2xl font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                {suggestedAmount > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Suggested: ${suggestedAmount.toFixed(2)} • Min: $0.10
                                    </p>
                                )}
                            </div>

                            {/* Token Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pay with</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedToken(Tokens.WLD)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl text-sm font-medium transition-all",
                                            selectedToken === Tokens.WLD
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                        )}
                                    >
                                        WLD
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedToken(Tokens.USDC)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl text-sm font-medium transition-all",
                                            selectedToken === Tokens.USDC
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                        )}
                                    >
                                        USDC
                                    </button>
                                </div>
                            </div>

                            {/* Recipient Info */}
                            <div className="p-3 bg-secondary/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Paying to</p>
                                <p className="font-medium">{recipientName || recipient}</p>
                                {recipientName && (
                                    <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                                        {recipient.slice(0, 6)}...{recipient.slice(-4)}
                                    </p>
                                )}
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSettleUp}
                                disabled={loading || !amount || parseFloat(amount) <= 0}
                                className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all hover:brightness-110 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : `Send ${amount || "0"} ${selectedToken}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
