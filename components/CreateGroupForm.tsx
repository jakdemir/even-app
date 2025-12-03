"use client";

import { useState } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";

export default function CreateGroupForm({ onSuccess }: { onSuccess?: () => void }) {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createGroup } = useExpenses();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const newGroupId = await createGroup(name.trim());
            if (newGroupId) {
                setName("");
                onSuccess?.();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
                type="text"
                placeholder="Group Name (e.g. Trip to Japan)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                disabled={isSubmitting}
            />
            <button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 active:scale-95 transition-all"
            >
                {isSubmitting ? "Creating..." : "Create Group"}
            </button>
        </form>
    );
}
