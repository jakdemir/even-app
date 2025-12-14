"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-4 py-20 md:py-32 relative">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Now available on World App
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                            Split Expenses
                            <br />
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                The Easy Way
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                            Track shared expenses with friends and settle up instantly using crypto.
                            No more awkward money conversations.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/app"
                                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                            >
                                Open App →
                            </Link>
                            <a
                                href="#features"
                                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg hover:bg-secondary/80 transition-all"
                            >
                                Learn More
                            </a>
                        </div>

                        <div className="pt-8">
                            <div className="relative mx-auto max-w-3xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-3xl"></div>
                                <div className="relative bg-background/50 backdrop-blur-sm border rounded-2xl p-8 shadow-2xl">
                                    <div className="grid grid-cols-3 gap-8 text-center">
                                        <div>
                                            <div className="text-3xl md:text-4xl font-bold text-primary">Free</div>
                                            <div className="text-sm text-muted-foreground mt-1">Always</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl md:text-4xl font-bold text-primary">Instant</div>
                                            <div className="text-sm text-muted-foreground mt-1">Settlements</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl md:text-4xl font-bold text-primary">Secure</div>
                                            <div className="text-sm text-muted-foreground mt-1">Blockchain</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to make expense sharing effortless
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1 */}
                        <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-all hover:scale-105">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold mb-3">Group Expenses</h3>
                            <p className="text-muted-foreground">
                                Create groups for trips, roommates, or any shared expenses. Invite friends with a simple link.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-all hover:scale-105">
                            <div className="text-4xl mb-4">🧮</div>
                            <h3 className="text-xl font-semibold mb-3">Smart Splitting</h3>
                            <p className="text-muted-foreground">
                                Split expenses equally, by amount, percentage, or shares. Even handles the complex math.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-all hover:scale-105">
                            <div className="text-4xl mb-4">💰</div>
                            <h3 className="text-xl font-semibold mb-3">Crypto Payments</h3>
                            <p className="text-muted-foreground">
                                Settle up instantly with USDC or WLD using your World App wallet. No bank transfers needed.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-all hover:scale-105">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
                            <p className="text-muted-foreground">
                                See who owes what at a glance. Automatic debt calculation keeps everyone on the same page.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-all hover:scale-105">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                            <p className="text-muted-foreground">
                                Your data is protected with encryption and row-level security. Only you and your group can see expenses.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-all hover:scale-105">
                            <div className="text-4xl mb-4">📱</div>
                            <h3 className="text-xl font-semibold mb-3">World App Native</h3>
                            <p className="text-muted-foreground">
                                Built specifically for World App. Seamless wallet integration and native mobile experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 md:py-32 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                                1
                            </div>
                            <h3 className="text-xl font-semibold">Create a Group</h3>
                            <p className="text-muted-foreground">
                                Start a new group for your trip, dinner, or shared apartment. Invite friends with a link.
                            </p>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                                2
                            </div>
                            <h3 className="text-xl font-semibold">Add Expenses</h3>
                            <p className="text-muted-foreground">
                                Record who paid and how to split it. Even automatically calculates who owes what.
                            </p>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                                3
                            </div>
                            <h3 className="text-xl font-semibold">Settle Up</h3>
                            <p className="text-muted-foreground">
                                Pay your friends instantly with crypto. No more IOUs or awkward reminders.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-12 md:p-16">
                        <h2 className="text-3xl md:text-5xl font-bold">
                            Ready to Split Smarter?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Join thousands using Even to manage shared expenses. Free forever.
                        </p>
                        <Link
                            href="/app"
                            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
                        >
                            Get Started Now →
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Available exclusively on World App
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
