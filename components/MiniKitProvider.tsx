"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Install MiniKit on client side
        MiniKit.install();
        console.log("MiniKit installed");
    }, []);

    return <>{children}</>;
}
