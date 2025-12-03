"use client";

import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
    onSuccess: (address: string) => void;
    className?: string;
}

export default function AuthButton({ onSuccess, className }: AuthButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        // Mock Login Fallback if not installed
        if (!MiniKit.isInstalled()) {
            console.warn("MiniKit not installed. Using Mock Login.");
            setTimeout(() => {
                onSuccess("0xMockUserAddress123456789");
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            // Generate a random nonce
            const nonce = crypto.randomUUID().replace(/-/g, "");

            const authInput: WalletAuthInput = {
                nonce: nonce,
                requestId: "0",
                expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
                statement: "Sign in to Even App",
            };

            let address = "";
            const miniKit = MiniKit as any; // Cast to any to access commandsAsync if types are missing

            if (miniKit.commandsAsync) {
                const { finalPayload } = await miniKit.commandsAsync.walletAuth(authInput);
                if (finalPayload.status === "success") {
                    address = finalPayload.address;
                } else {
                    console.error("Wallet Auth failed", finalPayload);
                    alert("Authentication failed: " + JSON.stringify(finalPayload));
                    setLoading(false);
                    return;
                }
            } else {
                // Fallback for older versions: use commands.walletAuth and assume it returns result or fails
                // But since we are updating to latest, this branch shouldn't be hit if update works.
                // If it is hit, we might be in trouble.
                console.warn("MiniKit.commandsAsync not found. Trying legacy command.");

                // Legacy attempt (risky if types changed)
                const res = await MiniKit.commands.walletAuth(authInput);
                console.log("Legacy response:", res);
                // If legacy returns object with address, use it.
                if (res && (res as any).address) {
                    address = (res as any).address;
                } else {
                    alert("MiniKit version incompatibility. Please update World App.");
                    setLoading(false);
                    return;
                }
            }

            if (address) {
                // alert("Login Success: " + address); // Optional debug alert
                onSuccess(address);
            }

        } catch (error) {
            console.error("Login failed:", error);
            alert("Login Error: " + (error instanceof Error ? error.message : String(error)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogin}
            disabled={loading}
            className={cn(
                "w-full py-4 px-6 bg-foreground text-background font-bold rounded-2xl text-lg transition-all active:scale-95 disabled:opacity-50",
                className
            )}
        >
            {loading ? "Connecting Wallet..." : "Connect World Wallet"}
        </button>
    );
}
