"use client";

import { useState } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";
import CreateGroupForm from "./CreateGroupForm";
import { cn } from "@/lib/utils";

export default function GroupList() {
    const { groups, joinGroup, currentUser } = useExpenses();
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h2 className="text-xl font-bold">My Groups</h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    {isCreating ? "Cancel" : "+ New Group"}
                </button>
            </header>

            {isCreating && (
                <div className="p-4 rounded-xl border bg-card animate-in slide-in-from-top-2">
                    <CreateGroupForm onSuccess={() => setIsCreating(false)} />
                </div>
            )}

            <div className="grid gap-3">
                {groups.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border-dashed border-2">
                        <p>You don't have any groups yet.</p>
                        <p className="text-sm">Create one to start sharing expenses!</p>
                    </div>
                ) : (
                    groups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => joinGroup(group.id)}
                            className="w-full p-4 rounded-xl border bg-card hover:bg-secondary/50 transition-all text-left flex items-center justify-between group"
                        >
                            <div>
                                <h3 className="font-semibold">{group.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                    Created {new Date(group.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                →
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
