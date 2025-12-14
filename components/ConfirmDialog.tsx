import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = "info"
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: "bg-red-600 hover:bg-red-700 text-white",
        warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
        info: "bg-primary hover:bg-primary/90 text-primary-foreground"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-background border rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-foreground/80">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "px-4 py-2 rounded-lg font-medium transition-colors",
                            variantStyles[variant]
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
