"use client";

import { useIDKit, IDKitWidget, VerificationLevel, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
    onSuccess: (address: string, username?: string) => void;
    className?: string;
}

export default function AuthButton({ onSuccess, className }: AuthButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleVerify = async (result: ISuccessResult) => {
        console.log("✅ World ID Verification Success:", result);
        console.log("Nullifier Hash:", result.nullifier_hash);
        const mockWalletAddress = "0x" + result.nullifier_hash.slice(2, 42);
        console.log("Generated Mock Address:", mockWalletAddress);

        let username;
        // @ts-ignore
        if (typeof window !== 'undefined' && window.MiniKit?.isInstalled()) {
            // @ts-ignore
            username = window.MiniKit.user?.username;
            console.log("MiniKit username:", username);
        }

        onSuccess(mockWalletAddress, username);
    };

    const handleError = (error: any) => {
        console.error("❌ IDKit Widget Error:", error);
        setLoading(false);
    };

    // Predefined mock users for testing
    const mockUsers = [
        { address: "0x1111111111111111111111111111111111111111", name: "Alice" },
        { address: "0x2222222222222222222222222222222222222222", name: "Bob" },
        { address: "0x3333333333333333333333333333333333333333", name: "Charlie" },
        { address: "0x4444444444444444444444444444444444444444", name: "Diana" },
    ];

    return (
        <div className="w-full space-y-2">
            <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
                action="login"
                onSuccess={handleVerify}
                handleVerify={handleVerify}
                onError={handleError}
                verification_level={VerificationLevel.Device}
                // @ts-ignore
                title="Sign in with World ID"
                // @ts-ignore
                description="Please scan the QR code to log in."
            >
                {({ open }) => (
                    <button
                        onClick={open}
                        disabled={loading}
                        className={cn(
                            "w-full py-4 px-6 bg-foreground text-background font-bold rounded-2xl text-lg transition-all active:scale-95 disabled:opacity-50",
                            className
                        )}
                    >
                        {loading ? "Connecting..." : "Sign in with World ID"}
                    </button>
                )}
            </IDKitWidget>
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
