"use client";

import { useState } from "react";
import { useExpenses } from "@/contexts/ExpenseContext";
import CreateGroupForm from "./CreateGroupForm";
import { cn } from "@/lib/utils";

export default function GroupList() {
    const { groups, joinGroup, removeFromGroup, currentUser } = useExpenses();
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [groupIdInput, setGroupIdInput] = useState("");
    const [isJoiningGroup, setIsJoiningGroup] = useState(false);
    const [joinError, setJoinError] = useState<string | null>(null);
    const [leaveConfirm, setLeaveConfirm] = useState<string | null>(null);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleManualJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupIdInput.trim()) return;

        setIsJoiningGroup(true);
        setJoinError(null);

        try {
            const success = await joinGroup(groupIdInput.trim());
            if (success) {
                setGroupIdInput("");
                setIsJoining(false);
            } else {
                setJoinError("Unable to join group. The group ID may be invalid or you may already be a member.");
            }
        } catch (error) {
            setJoinError("An error occurred while joining the group.");
        } finally {
            setIsJoiningGroup(false);
        }
    };

    const handleLeaveGroup = async (groupId: string) => {
        setIsLeaving(true);
        try {
            await removeFromGroup(groupId);
            setLeaveConfirm(null);
        } catch (error) {
            console.error("Error leaving group:", error);
            alert("Failed to leave group. Please try again.");
        } finally {
            setIsLeaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <h2 className="text-xl font-bold">My Groups</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setIsJoining(!isJoining);
                            setIsCreating(false);
                            setJoinError(null);
                        }}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        {isJoining ? "Cancel" : "+ Join Group"}
                    </button>
                    <button
                        onClick={() => {
                            setIsCreating(!isCreating);
                            setIsJoining(false);
                        }}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        {isCreating ? "Cancel" : "+ New Group"}
                    </button>
                </div>
            </header>

            {isCreating && (
                <div className="p-4 rounded-xl border bg-card animate-in slide-in-from-top-2">
                    <CreateGroupForm onSuccess={() => setIsCreating(false)} />
                </div>
            )}

            {isJoining && (
                <div className="p-4 rounded-xl border bg-card animate-in slide-in-from-top-2">
                    <form onSubmit={handleManualJoin} className="space-y-3">
                        <div>
                            <label htmlFor="groupId" className="block text-sm font-medium mb-2">
                                Enter Group ID
                            </label>
                            <input
                                id="groupId"
                                type="text"
                                value={groupIdInput}
                                onChange={(e) => setGroupIdInput(e.target.value)}
                                placeholder="e.g., 6fcfc578-366b-4b7a-bb02-4f83a1f41f01"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isJoiningGroup}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Paste the group ID shared by another member
                            </p>
                        </div>
                        {joinError && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50">
                                <p className="text-sm text-red-600 dark:text-red-400">{joinError}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={!groupIdInput.trim() || isJoiningGroup}
                            className="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isJoiningGroup ? "Joining..." : "Join Group"}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid gap-3">
                {groups.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border-dashed border-2">
                        <p>No groups yet.</p>
                        <p className="text-sm">Create one to start sharing expenses!</p>
                    </div>
                ) : (
                    // Sort groups by created_at descending (most recent first) before rendering
                    [...groups]
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .map((group) => {
                            const createdDate = new Date(group.created_at);
                            const formattedDate = createdDate.toLocaleDateString('en-US', {
                                month: 'numeric',
                                day: 'numeric',
                                year: 'numeric'
                            });
                            const formattedTime = createdDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            });

                            return (
                                <div
                                    key={group.id}
                                    className="w-full p-4 rounded-xl border bg-card hover:bg-secondary/50 transition-all flex items-center justify-between group"
                                >
                                    <button
                                        onClick={() => joinGroup(group.id)}
                                        className="flex-1 text-left flex items-center justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg">{group.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-1 font-medium">
                                                Created at {formattedDate} {formattedTime}
                                            </p>
                                        </div>
                                        <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                            →
                                        </div>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLeaveConfirm(group.id);
                                        }}
                                        className="ml-3 p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                        title="Leave group"
                                    >
                                        🚪
                                    </button>
                                </div>
                            );
                        })
                )}
            </div>

            {/* Leave Confirmation Modal */}
            {leaveConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl p-6 max-w-sm w-full border shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Leave Group?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            You will be removed from this group and will no longer see its expenses. You can rejoin later if you have the group ID or invite link.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setLeaveConfirm(null)}
                                disabled={isLeaving}
                                className="flex-1 py-2 px-4 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 disabled:opacity-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleLeaveGroup(leaveConfirm)}
                                disabled={isLeaving}
                                className="flex-1 py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all"
                            >
                                {isLeaving ? "Leaving..." : "Leave"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
