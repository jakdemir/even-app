"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SetUsernameFormProps {
    onSetUsername: (username: string) => void;
    className?: string;
}

export default function SetUsernameForm({ onSetUsername, className }: SetUsernameFormProps) {
    const [username, setUsername] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;
        onSetUsername(username.trim());
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-4 p-6 bg-card rounded-xl border shadow-sm text-center", className)}>
            <h2 className="text-xl font-bold">Welcome to Even</h2>
            <p className="text-sm text-muted-foreground">Choose a display name so friends know who you are.</p>

            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Alice"
                className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all text-center"
            />

            <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl active:scale-95 transition-all"
            >
                Continue
            </button>
        </form>
    );
}
