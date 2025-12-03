"use client";

import { IDKitWidget, VerificationLevel, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
    onSuccess: (address: string) => void;
    className?: string;
}

export default function AuthButton({ onSuccess, className }: AuthButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleVerify = async (result: ISuccessResult) => {
        console.log("World ID Verification Success:", result);
        // In a real app, you would verify the proof on your backend here.
        // For MVP, we use the nullifier_hash as a unique user ID.
        // We simulate a wallet address format for compatibility with the rest of the app.
        const mockWalletAddress = "0x" + result.nullifier_hash.slice(2, 42);
        onSuccess(mockWalletAddress);
    };

    return (
        <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
            action="login"
            onSuccess={handleVerify}
            handleVerify={handleVerify}
            verification_level={VerificationLevel.Device} // Use 'Device' for Simulator testing
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
                    Sign in with World ID
                </button>
            )}
        </IDKitWidget>
    );
}
