import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/MiniKitProvider";
import ErudaProvider from "@/components/ErudaProvider";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Even - Split Expenses with Friends",
  description: "Split bills and track shared expenses effortlessly with your friends on World App. Settle up instantly using crypto.",
  keywords: ["expense sharing", "split bills", "World App", "crypto payments", "group expenses", "USDC", "WLD"],
  authors: [{ name: "Even App" }],
  metadataBase: new URL("https://even-app.com"),
  openGraph: {
    title: "Even - Split Expenses with Friends",
    description: "Split bills and track shared expenses effortlessly with your friends on World App. Settle up instantly using crypto.",
    type: "website",
    url: "https://even-app.com",
    siteName: "Even",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 600,
        alt: "Even - Expense Sharing App"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Even - Split Expenses with Friends",
    description: "Split bills and track shared expenses effortlessly with your friends on World App.",
    images: ["/og-image.png"]
  }
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
            <ErudaProvider>
              {children}
              <SpeedInsights />
              <Analytics />
            </ErudaProvider>
          </ExpenseProvider>
        </MiniKitProvider>
      </body>
    </html>
  );
}
