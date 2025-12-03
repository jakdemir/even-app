"use client";

import { useEffect } from "react";

export default function ErudaProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            import("eruda").then((eruda) => eruda.default.init());
        }
    }, []);

    return <div className="min-h-screen bg-background font-sans antialiased">{children}</div>;
}
