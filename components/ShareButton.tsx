"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    groupId: string;
    className?: string;
}

export default function ShareButton({ groupId, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareText = `Join my expense group on Even! Use this Group ID: ${groupId}`;



        // Try native share first (works great on mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join my Even Group',
                    text: shareText,
                });

                return;
            } catch (err) {

            }
        }

        // Fallback to clipboard - copy just the group ID
        try {
            await navigator.clipboard.writeText(groupId);

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
            // Fallback for non-secure contexts or older browsers
            const textArea = document.createElement("textarea");
            textArea.value = groupId;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (e) {
                console.error("Fallback copy failed", e);
                // Group ID copied to clipboard
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                copied
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                className
            )}
        >
            {copied ? (
                <>
                    <span>✓</span>
                    <span>Copied ID</span>
                </>
            ) : (
                <>
                    <span>↗</span>
                    <span>Share ID</span>
                </>
            )}
        </button>
    );
}
