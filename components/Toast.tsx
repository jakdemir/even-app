import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
        info: "bg-primary text-primary-foreground"
    };

    const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ"
    };

    return (
        <div
            className={cn(
                "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300",
                typeStyles[type],
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
        >
            <span className="text-lg font-bold">{icons[type]}</span>
            <p className="font-medium">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-2 hover:opacity-80"
            >
                ✕
            </button>
        </div>
    );
}
