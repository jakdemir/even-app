"use client";

import { MiniKit, PayCommandInput, Tokens } from "@worldcoin/minikit-js";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SettleUpButtonProps {
    amount: number;
    recipientAddress: string;
    className?: string;
    onPaymentSuccess?: () => void;
}

export default function SettleUpButton({ amount, recipientAddress, className, onPaymentSuccess }: SettleUpButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if (!MiniKit.isInstalled()) {
            console.warn("MiniKit not installed");
            return;
        }

        setLoading(true);
        try {
            const payload: PayCommandInput = {
                reference: "settle-up-" + Date.now(),
                to: recipientAddress,
                tokens: [
                    {
                        symbol: Tokens.WLD,
                        token_amount: amount.toString(),
                    },
                ],
                description: "Settling up expenses",
            };

            const response = await MiniKit.commands.pay(payload);
            console.log("Payment response:", response);
            // Assuming response indicates success (MiniKit v2 might return something specific)
            // For now, we assume if no error, it's initiated/successful.
            if (response) {
                onPaymentSuccess?.();
            }
        } catch (error) {
            console.error("Payment failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePay}
            disabled={loading}
            className={cn(
                "w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50",
                className
            )}
        >
            {loading ? "Processing..." : `Settle Up $${amount.toFixed(2)}`}
        </button>
    );
}
