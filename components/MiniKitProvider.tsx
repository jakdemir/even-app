"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        MiniKit.install();
        console.log("MiniKit installed:", MiniKit.isInstalled());
        console.log("MiniKit object keys:", Object.keys(MiniKit));
    }, []);

    return <>{children}</>;
}
