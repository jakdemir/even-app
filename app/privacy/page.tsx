import { cn } from "@/lib/utils";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground mb-8">
                    Last Updated: December 14, 2025
                </p>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                        <p className="text-foreground/90">
                            Welcome to Even ("we," "our," or "us"). We are committed to
                            protecting your privacy. This Privacy Policy explains how we
                            collect, use, and safeguard your information when you use our
                            expense-sharing application within the World App.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            2. Information We Collect
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium mb-2">2.1 Wallet Information</h3>
                                <p className="text-foreground/90">
                                    We collect your World App wallet address for authentication
                                    purposes. This is used to identify you within the application
                                    and associate your expenses and groups with your account.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">2.2 Profile Information</h3>
                                <p className="text-foreground/90">
                                    We collect your display name (username) that you choose to
                                    set within the app. This is used to identify you to other
                                    users in shared groups.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">2.3 Expense Data</h3>
                                <p className="text-foreground/90">
                                    We collect and store information about expenses you create or
                                    participate in, including:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-foreground/90">
                                    <li>Expense descriptions and amounts</li>
                                    <li>Payment records and settlements</li>
                                    <li>Group memberships and group names</li>
                                    <li>Split configurations (equal, unequal, percentage)</li>
                                    <li>Timestamps of expense creation and modifications</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            3. How We Use Your Information
                        </h2>
                        <p className="text-foreground/90 mb-2">
                            We use the collected information for the following purposes:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/90">
                            <li>To authenticate and identify you within the application</li>
                            <li>To track and calculate shared expenses and debts</li>
                            <li>To enable group expense sharing functionality</li>
                            <li>To facilitate settlements between users</li>
                            <li>To provide you with expense summaries and reports</li>
                            <li>To improve and optimize our service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            4. Data Storage and Security
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium mb-2">4.1 Storage</h3>
                                <p className="text-foreground/90">
                                    Your data is stored securely using Supabase, a
                                    PostgreSQL-based database service. All data is encrypted in
                                    transit using HTTPS and at rest using industry-standard
                                    encryption.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">4.2 Access Control</h3>
                                <p className="text-foreground/90">
                                    We implement Row Level Security (RLS) policies to ensure that
                                    you can only access your own data and the data of groups you
                                    are a member of. Other users cannot view or modify your
                                    personal information or expenses.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
                        <p className="text-foreground/90 mb-2">
                            We do not sell, trade, or rent your personal information to third
                            parties. Your data is shared only in the following limited
                            circumstances:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/90">
                            <li>
                                <strong>With Group Members:</strong> Your display name and
                                expense information is visible to other members of groups you
                                join
                            </li>
                            <li>
                                <strong>Service Providers:</strong> We use Supabase for data
                                storage and Vercel for hosting, both of which have their own
                                privacy policies
                            </li>
                            <li>
                                <strong>Legal Requirements:</strong> We may disclose
                                information if required by law or to protect our rights
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
                        <p className="text-foreground/90 mb-2">You have the right to:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/90">
                            <li>Access your personal data stored in our application</li>
                            <li>Update or correct your display name and profile information</li>
                            <li>Delete your expenses and leave groups</li>
                            <li>
                                Request deletion of your account and all associated data
                            </li>
                            <li>Export your expense data</li>
                        </ul>
                        <p className="text-foreground/90 mt-3">
                            To exercise these rights, please contact us at{" "}
                            <a
                                href="mailto:support@even-app.com"
                                className="text-primary hover:underline"
                            >
                                support@even-app.com
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            7. Data Retention
                        </h2>
                        <p className="text-foreground/90">
                            We retain your data for as long as your account is active or as
                            needed to provide you services. If you request account deletion,
                            we will delete your personal information within 30 days, except
                            where we are required to retain it for legal purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
                        <p className="text-foreground/90">
                            Our service is not intended for users under the age of 13. We do
                            not knowingly collect personal information from children under 13.
                            If you are a parent or guardian and believe your child has
                            provided us with personal information, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            9. International Users
                        </h2>
                        <p className="text-foreground/90">
                            Your information may be transferred to and processed in countries
                            other than your own. By using Even, you consent to the transfer
                            of your information to our facilities and service providers
                            globally.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            10. Changes to This Policy
                        </h2>
                        <p className="text-foreground/90">
                            We may update this Privacy Policy from time to time. We will
                            notify you of any changes by updating the "Last Updated" date at
                            the top of this policy. Your continued use of Even after changes
                            are made constitutes acceptance of those changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
                        <p className="text-foreground/90">
                            If you have any questions about this Privacy Policy or our data
                            practices, please contact us at:
                        </p>
                        <p className="mt-2">
                            <a
                                href="mailto:support@even-app.com"
                                className="text-primary hover:underline font-medium"
                            >
                                support@even-app.com
                            </a>
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-6 border-t border-border">
                    <a
                        href="/"
                        className={cn(
                            "inline-flex items-center text-primary hover:underline"
                        )}
                    >
                        ← Back to App
                    </a>
                </div>
            </div>
        </div>
    );
}
