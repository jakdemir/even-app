import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    console.log('[API] GET /api/nonce - Request received');

    try {
        // Generate a random nonce (expects only alphanumeric characters)
        const nonce = crypto.randomUUID().replace(/-/g, "");
        console.log('[API] Nonce generated', { nonceLength: nonce.length });

        // Store the nonce in a cookie that is not tamperable by the client
        const cookieStore = await cookies();
        cookieStore.set("siwe", nonce, {
            secure: true,
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 5 // 5 minutes
        });

        console.log('[API] Nonce stored in cookie with 5min expiry');
        console.log('[API] GET /api/nonce - Success');

        return NextResponse.json({ nonce });
    } catch (error) {
        console.error('[API] GET /api/nonce - Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate nonce' },
            { status: 500 }
        );
    }
}
