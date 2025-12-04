"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
    onSuccess: (address: string, username?: string) => void;
    className?: string;
}

export default function AuthButton({ onSuccess, className }: AuthButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleWalletAuth = async () => {
        setLoading(true);
        try {
            console.log("Starting wallet auth...");

            // Step 1: Get nonce from server
            const res = await fetch(`/api/nonce`);
            const { nonce } = await res.json();

            console.log("Nonce received:", nonce);

            // Step 2: Request wallet authentication from MiniKit
            const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce: nonce,
                requestId: '0',
                expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                statement: 'Sign in to Even - Split expenses with friends',
            });

            console.log("Wallet auth response:", { commandPayload, finalPayload });

            // Step 3: Check for errors
            if (finalPayload.status === 'error') {
                console.error("Wallet auth error:", finalPayload);
                setLoading(false);
                return;
            }

            // Step 4: Verify the signature on the server
            const verifyResponse = await fetch('/api/complete-siwe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payload: finalPayload,
                    nonce,
                }),
            });

            const verifyResult = await verifyResponse.json();
            console.log("Verification result:", verifyResult);

            if (verifyResult.isValid) {
                const username = MiniKit.user?.username;
                console.log("Login successful - Address:", verifyResult.address, "Username:", username);
                onSuccess(verifyResult.address, username);
            } else {
                console.error("Signature verification failed:", verifyResult.message);
                setLoading(false);
            }
        } catch (error) {
            console.error("Wallet authentication exception:", error);
            setLoading(false);
        }
    };

    // Mock users for development testing
    const mockUsers = [
        { address: "0x1111111111111111111111111111111111111111", name: "Alice" },
        { address: "0x2222222222222222222222222222222222222222", name: "Bob" },
        { address: "0x3333333333333333333333333333333333333333", name: "Charlie" },
        { address: "0x4444444444444444444444444444444444444444", name: "Diana" },
    ];

    return (
        <div className="w-full space-y-2">
            <button
                onClick={handleWalletAuth}
                disabled={loading}
                className={cn(
                    "w-full py-4 px-6 bg-foreground text-background font-bold rounded-2xl text-lg transition-all active:scale-95 disabled:opacity-50",
                    className
                )}
            >
                {loading ? "Authenticating..." : "Sign in with Wallet"}
            </button>
            {process.env.NODE_ENV === 'development' && (
                <div className="space-y-2 pt-2">
                    <p className="text-xs text-muted-foreground text-center">Dev Mode - Mock Users:</p>
                    {mockUsers.map((user) => (
                        <button
                            key={user.address}
                            onClick={() => onSuccess(user.address, user.name)}
                            className="w-full py-2 px-4 text-sm bg-secondary hover:bg-secondary/80 rounded-xl transition-all"
                        >
                            Login as {user.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
