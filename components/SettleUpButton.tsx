"use client";

import { MiniKit, PayCommandInput, Tokens, type ResponseEvent } from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SettleUpButtonProps {
    suggestedAmount?: number;
    recipient: string;
    recipientName?: string;
    disabled?: boolean;
    className?: string;
    onPaymentSuccess?: () => void;
}

export default function SettleUpButton({ suggestedAmount = 0, recipient, recipientName, disabled, className, onPaymentSuccess }: SettleUpButtonProps) {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectedToken, setSelectedToken] = useState<typeof Tokens.WLD | typeof Tokens.USDC>(Tokens.USDC);

    // Set amount when suggestedAmount changes
    useEffect(() => {
        if (suggestedAmount > 0) {
            setAmount(suggestedAmount.toFixed(2));
        }
    }, [suggestedAmount]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        if (suggestedAmount > 0) {
            setAmount(suggestedAmount.toFixed(2));
        }
    };

    const handleSettleUp = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount < 0.1) {
            return;
        }

        setLoading(true);

        try {
            const payload: PayCommandInput = {
                reference: `settle-up-${Date.now()}`,
                to: recipient,
                tokens: [
                    {
                        symbol: selectedToken,
                        token_amount: parsedAmount.toString(),
                    },
                ],
                description: `Settle up${recipientName ? ` to ${recipientName}` : ''}`,
            };

            const result = await MiniKit.commandsAsync.pay(payload);

            if (result.finalPayload.status === "success") {
                setIsModalOpen(false);
                if (onPaymentSuccess) {
                    onPaymentSuccess();
                }
            }
        } catch (error) {
            console.error("Payment failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                disabled={disabled}
                className={cn(
                    "flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
            >
                Settle Up
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background w-full max-w-md rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl">Settle Up Payment</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Amount */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">$</span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={amount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                setAmount(value);
                                            }
                                        }}
                                        placeholder="0.00"
                                        className="w-full p-4 pl-10 bg-secondary/30 rounded-2xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Suggested: ${suggestedAmount.toFixed(2)} • Min: $0.10
                                </p>
                            </div>

                            {/* Token Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Pay with</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedToken(Tokens.WLD)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl font-medium transition-all",
                                            selectedToken === Tokens.WLD
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "bg-secondary hover:bg-secondary/80"
                                        )}
                                    >
                                        WLD
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedToken(Tokens.USDC)}
                                        className={cn(
                                            "flex-1 py-3 rounded-xl font-medium transition-all",
                                            selectedToken === Tokens.USDC
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "bg-secondary hover:bg-secondary/80"
                                        )}
                                    >
                                        USDC
                                    </button>
                                </div>
                            </div>

                            {/* Recipient */}
                            <div className="p-3 bg-secondary/30 rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">Paying to</p>
                                <p className="font-medium">{recipientName || recipient}</p>
                                {recipientName && (
                                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                                        {recipient.slice(0, 6)}...{recipient.slice(-4)}
                                    </p>
                                )}
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSettleUp}
                                disabled={loading || !amount || parseFloat(amount) < 0.1}
                                className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? "Processing..." : `Send $${amount || "0"} ${selectedToken}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
