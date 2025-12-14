import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Footer() {
    return (
        <footer className="border-t border-border mt-12 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>© 2024 Even</span>
                        <span className="hidden sm:inline">•</span>
                        <a
                            href="mailto:even-app@proton.me"
                            className="hover:text-foreground transition-colors"
                        >
                            even-app@proton.me
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/privacy"
                            className={cn(
                                "hover:text-foreground transition-colors underline-offset-4 hover:underline"
                            )}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className={cn(
                                "hover:text-foreground transition-colors underline-offset-4 hover:underline"
                            )}
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
