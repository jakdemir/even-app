import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
    MiniAppWalletAuthSuccessPayload,
    verifySiweMessage,
} from "@worldcoin/minikit-js";

interface IRequestPayload {
    payload: MiniAppWalletAuthSuccessPayload;
    nonce: string;
}

export async function POST(req: NextRequest) {
    console.log('[API] POST /api/complete-siwe - Request received');

    try {
        const { payload, nonce } = (await req.json()) as IRequestPayload;
        console.log('[API] Request payload received', {
            hasPayload: !!payload,
            hasNonce: !!nonce,
            payloadStatus: payload?.status,
            address: payload?.address?.substring(0, 10) + '...'
        });

        // Verify the nonce matches what we stored
        const cookieStore = await cookies();
        const storedNonce = cookieStore.get("siwe")?.value;

        console.log('[API] Nonce verification', {
            hasStoredNonce: !!storedNonce,
            nonceMatch: nonce === storedNonce
        });

        if (nonce !== storedNonce) {
            console.error('[API] Nonce mismatch - Invalid or expired');
            return NextResponse.json({
                status: "error",
                isValid: false,
                message: "Invalid nonce",
            });
        }

        console.log('[API] Verifying SIWE message signature...');
        // Verify the SIWE message signature
        const validMessage = await verifySiweMessage(payload, nonce);

        console.log('[API] SIWE verification result', {
            isValid: validMessage.isValid
        });

        if (validMessage.isValid) {
            // Clear the nonce after successful verification
            cookieStore.delete("siwe");
            console.log('[API] Nonce cleared from cookie');
            console.log('[API] POST /api/complete-siwe - Success', {
                address: payload.address
            });

            return NextResponse.json({
                status: "success",
                isValid: true,
                address: payload.address,
            });
        } else {
            console.error('[API] Invalid signature');
            return NextResponse.json({
                status: "error",
                isValid: false,
                message: "Invalid signature",
            });
        }
    } catch (error: any) {
        console.error('[API] POST /api/complete-siwe - Error:', {
            message: error?.message,
            stack: error?.stack
        });
        return NextResponse.json({
            status: "error",
            isValid: false,
            message: error.message || "Verification failed",
        });
    }
}
