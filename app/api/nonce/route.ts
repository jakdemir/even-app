import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // Generate a random nonce (expects only alphanumeric characters)
    const nonce = crypto.randomUUID().replace(/-/g, "");

    // Store the nonce in a cookie that is not tamperable by the client
    // Optionally you can HMAC the nonce with a secret key stored in your environment
    const cookieStore = await cookies();
    cookieStore.set("siwe", nonce, {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 5 // 5 minutes
    });

    return NextResponse.json({ nonce });
}
