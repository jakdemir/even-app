"use client";

import { MiniKit, PayCommandInput, Tokens } from "@worldcoin/minikit-js";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SettleUpButtonProps {
    amount: number;
    recipient: string;
    disabled?: boolean;
    className?: string;
    onPaymentSuccess?: () => void;
}

export default function SettleUpButton({ amount, recipient, disabled, className, onPaymentSuccess }: SettleUpButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleSettleUp = async () => {
        if (disabled) return;

        setLoading(true);

        // Check if MiniKit is available
        if (!MiniKit.isInstalled()) {
            setLoading(false);
            alert("World App MiniKit is not available. Please use 'Record Payment' to manually record the payment.");
            return;
        }

        try {
            const payload: PayCommandInput = {
                reference: "settle-up-" + Date.now(),
                to: recipient,
                tokens: [
                    {
                        symbol: Tokens.WLD,
                        token_amount: amount.toString(),
                    },
                ],
                description: "Settle up on Even",
            };

            const { finalPayload } = await MiniKit.commandsAsync.pay(payload);
            if (finalPayload.status === "success") {
                onPaymentSuccess?.();
            }
        } catch (error) {
            console.error("Payment failed", error);
            alert("Payment failed. Please try again or use 'Record Payment' to manually record the payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSettleUp}
            disabled={loading || disabled}
            className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl active:scale-95 transition-all disabled:opacity-50",
                className
            )}
        >
            {loading ? "Processing..." : "Settle Up"}
        </button>
    );
}
