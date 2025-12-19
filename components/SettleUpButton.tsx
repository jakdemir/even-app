"use client";

import { MiniKit, PayCommandInput, Tokens, type ResponseEvent } from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { convertUSDtoWLD } from "@/lib/price-converter";

interface SettleUpButtonProps {
    suggestedAmount?: number;
    recipient: string;
    recipientName?: string;
    disabled?: boolean;
    className?: string;
    onPaymentSuccess?: (metadata?: { wldAmount: number; exchangeRate: number; token: string }) => void;
}

export default function SettleUpButton({ suggestedAmount = 0, recipient, recipientName, disabled, className, onPaymentSuccess }: SettleUpButtonProps) {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [wldAmount, setWldAmount] = useState<number>(0);
    const [exchangeRate, setExchangeRate] = useState<number>(2.00);

    // Set amount when suggestedAmount changes
    useEffect(() => {
        if (suggestedAmount > 0) {
            setAmount(suggestedAmount.toFixed(2));
        }
    }, [suggestedAmount]);

    // Update WLD amount when USD amount changes
    useEffect(() => {
        // Don't fetch if modal isn't open or amount is invalid
        if (!isModalOpen || !amount) {
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setWldAmount(0);
            return;
        }

        // Debounce the API call
        const timeoutId = setTimeout(async () => {
            try {
                const { wldAmount: converted, exchangeRate: rate } = await convertUSDtoWLD(parsedAmount);
                setWldAmount(converted);
                setExchangeRate(rate);
            } catch (error) {
                console.error('Error converting USD to WLD:', error);
                // Use fallback values if API fails
                setExchangeRate(2.00);
                setWldAmount(parsedAmount / 2.00);
            }
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timeoutId);
    }, [amount, isModalOpen]);

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
            // Get WLD conversion with error handling
            let convertedWLD: number;
            let rate: number;

            try {
                const conversion = await convertUSDtoWLD(parsedAmount);
                convertedWLD = conversion.wldAmount;
                rate = conversion.exchangeRate;
            } catch (conversionError) {
                console.error('Price conversion failed, using fallback:', conversionError);
                // Use fallback rate if API fails
                rate = 2.00;
                convertedWLD = parsedAmount / rate;
            }

            const payload: PayCommandInput = {
                reference: `settle-up-${Date.now()}`,
                to: recipient,
                tokens: [
                    {
                        symbol: Tokens.WLD,
                        token_amount: convertedWLD.toString(),
                    },
                ],
                description: `Settle up${recipientName ? ` to ${recipientName}` : ''}`,
            };

            console.log('💸 [SETTLE UP] Payment payload:', payload);

            const result = await MiniKit.commandsAsync.pay(payload);

            if (result.finalPayload.status === "success") {
                setIsModalOpen(false);
                if (onPaymentSuccess) {
                    onPaymentSuccess({
                        wldAmount: convertedWLD,
                        exchangeRate: rate,
                        token: 'WLD'
                    });
                }
            }
        } catch (error) {
            console.error("Payment failed:", error);
            alert('Payment failed. Please try again.');
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

                            {/* WLD Conversion Display */}
                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                                <p className="text-xs text-muted-foreground mb-1">You will pay</p>
                                <p className="font-bold text-lg text-primary">
                                    ≈ {wldAmount.toFixed(4)} WLD
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    at ${exchangeRate.toFixed(2)} per WLD
                                </p>
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
                                {loading ? "Processing..." : `Send $${amount || "0"} (${wldAmount.toFixed(4)} WLD)`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
