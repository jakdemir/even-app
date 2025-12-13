"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface AuthButtonProps {
    onSuccess: (address: string, username?: string) => void;
    className?: string;
}

export default function AuthButton({ onSuccess, className }: AuthButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleWalletAuth = async () => {
        setLoading(true);
        try {
            logger.userAction('Wallet Auth Started');

            // Check if MiniKit is available (only works in World App)
            if (!MiniKit.isInstalled()) {
                setLoading(false);
                console.error('MiniKit not available. Please open this app in World App.');
                return;
            }

            // Step 1: Get nonce from server
            logger.apiCall('/api/nonce', 'GET');
            const res = await fetch(`/api/nonce`);
            const { nonce } = await res.json();

            logger.info('Nonce received', { nonceLength: nonce?.length });

            // Step 2: Request wallet authentication from MiniKit
            logger.debug('Calling MiniKit.commandsAsync.walletAuth');
            const { commandPayload, finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce: nonce,
                requestId: '0',
                expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                statement: 'Sign in to Even - Split expenses with friends',
            });

            logger.info('Wallet auth response received', {
                status: finalPayload.status,
                hasAddress: finalPayload.status === 'success' ? !!finalPayload.address : false
            });

            // Step 3: Check for errors
            if (finalPayload.status === 'error') {
                logger.error('Wallet auth error', finalPayload);
                setLoading(false);
                return;
            }

            // Step 4: Verify the signature on the server
            logger.apiCall('/api/complete-siwe', 'POST');
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
            logger.apiResponse('/api/complete-siwe', verifyResponse.status, {
                isValid: verifyResult.isValid
            });

            if (verifyResult.isValid) {
                const username = MiniKit.user?.username;
                logger.userAction('Login Successful', {
                    address: verifyResult.address,
                    username
                });
                onSuccess(verifyResult.address, username);
            } else {
                logger.error('Signature verification failed', null, {
                    message: verifyResult.message
                });
                setLoading(false);
            }
        } catch (error) {
            logger.error('Wallet authentication exception', error);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleWalletAuth}
            disabled={loading}
            className={cn(
                "w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl active:scale-95 transition-all disabled:opacity-50",
                className
            )}
        >
            {loading ? "Connecting..." : "Sign in with World ID"}
        </button>
    );
}
