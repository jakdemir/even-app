"use client";

import { useIDKit, IDKitWidget, VerificationLevel, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
    onSuccess: (address: string) => void;
    className?: string;
}

export default function AuthButton({ onSuccess, className }: AuthButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleVerify = async (result: ISuccessResult) => {
        console.log("✅ World ID Verification Success:", result);
        console.log("Nullifier Hash:", result.nullifier_hash);
        const mockWalletAddress = "0x" + result.nullifier_hash.slice(2, 42);
        console.log("Generated Mock Address:", mockWalletAddress);
        onSuccess(mockWalletAddress);
    };

    const handleError = (error: any) => {
        console.error("❌ IDKit Widget Error:", error);
        setLoading(false);
    };

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
                <button
                    onClick={() => onSuccess("0x1234567890abcdef1234567890abcdef12345678")}
                    className="w-full py-2 text-xs text-muted-foreground hover:text-primary underline"
                >
                    Mock Login (Dev Only)
                </button>
            )}
        </div>
    );
}
