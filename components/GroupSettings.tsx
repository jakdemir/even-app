"use client";

import { useState } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";

interface GroupSettingsProps {
    groupId: string;
    groupName: string;
}

export default function GroupSettings({ groupId, groupName }: GroupSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(groupName);
    const { updateGroup, deleteGroup, leaveGroup } = useExpenses();

    const handleRename = async () => {
        if (newName.trim() && newName !== groupName) {
            await updateGroup(groupId, newName.trim());
        }
        setIsRenaming(false);
        setIsOpen(false);
    };

    const handleDelete = async () => {
        if (confirm(`Delete "${groupName}"? This will delete all expenses in this group.`)) {
            await deleteGroup(groupId);
            leaveGroup();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
                ⚙️
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background w-full max-w-sm rounded-3xl p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-xl">Group Settings</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary/80"
                            >
                                ✕
                            </button>
                        </div>

                        {isRenaming ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Group name"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsRenaming(false)}
                                        className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRename}
                                        className="flex-1 py-2 bg-primary text-primary-foreground rounded-xl"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={() => setIsRenaming(true)}
                                    className="w-full p-3 text-left rounded-xl hover:bg-secondary/50 transition-colors"
                                >
                                    ✏️ Rename Group
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full p-3 text-left rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                                >
                                    🗑️ Delete Group
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
