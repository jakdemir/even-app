import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/MiniKitProvider";
import ErudaProvider from "@/components/ErudaProvider";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Even - Expense Sharing",
  description: "Split expenses easily with World App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <MiniKitProvider>
          <ExpenseProvider>
            <ErudaProvider>{children}</ErudaProvider>
          </ExpenseProvider>
        </MiniKitProvider>
      </body>
    </html>
  );
}
