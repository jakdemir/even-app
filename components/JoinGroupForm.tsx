"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface JoinGroupFormProps {
    onJoin: (groupId: string) => void;
    className?: string;
}

export default function JoinGroupForm({ onJoin, className }: JoinGroupFormProps) {
    const [groupId, setGroupId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupId.trim()) return;
        onJoin(groupId.trim());
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-4 p-6 bg-card rounded-xl border shadow-sm text-center", className)}>
            <h2 className="text-xl font-bold">Join a Group</h2>
            <p className="text-sm text-muted-foreground">Enter a room name to share expenses with friends.</p>

            <input
                type="text"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="e.g. Vegas Trip"
                className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all text-center"
            />

            <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl active:scale-95 transition-all"
            >
                Join Group
            </button>
        </form>
    );
}
