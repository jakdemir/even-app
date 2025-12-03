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
        const shareData = {
            title: 'Join my Even Group',
            text: `Join my expense group on Even! Group ID: ${groupId}`,
            url: window.location.href,
        };

        console.log("Attempting to share...");

        // Try native share first
        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                console.log("Native share successful");
                return;
            } catch (err) {
                console.log("Share cancelled or failed, falling back to clipboard", err);
            }
        }

        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(groupId);
            console.log("Clipboard copy successful");
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
                alert(`Group ID: ${groupId}`);
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
                    <span>Copied</span>
                </>
            ) : (
                <>
                    <span>↗</span>
                    <span>Share</span>
                </>
            )}
        </button>
    );
}
