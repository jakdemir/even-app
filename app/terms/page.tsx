import { cn } from "@/lib/utils";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                <p className="text-sm text-muted-foreground mb-8">
                    Last Updated: December 14, 2024
                </p>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-foreground/90">
                            By accessing and using Even ("the Service"), you accept and agree
                            to be bound by these Terms of Service ("Terms"). If you do not
                            agree to these Terms, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            2. Description of Service
                        </h2>
                        <p className="text-foreground/90">
                            Even is an expense-sharing application that allows users to track
                            shared expenses, calculate debts, and settle payments using
                            cryptocurrency through the World App. The Service is provided as
                            a Mini App within the World App ecosystem.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium mb-2">3.1 Account Creation</h3>
                                <p className="text-foreground/90">
                                    To use Even, you must authenticate using your World App
                                    wallet. You are responsible for maintaining the security of
                                    your wallet and account credentials.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">3.2 Account Responsibility</h3>
                                <p className="text-foreground/90">
                                    You are responsible for all activities that occur under your
                                    account. You agree to notify us immediately of any
                                    unauthorized use of your account.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">3.3 Accurate Information</h3>
                                <p className="text-foreground/90">
                                    You agree to provide accurate information when setting your
                                    display name and creating expense records. Misrepresentation
                                    of expenses or identity may result in account termination.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            4. User Responsibilities
                        </h2>
                        <p className="text-foreground/90 mb-2">
                            When using Even, you agree to:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-foreground/90">
                            <li>Use the Service only for lawful purposes</li>
                            <li>Accurately record and report shared expenses</li>
                            <li>Respect the privacy and data of other users</li>
                            <li>
                                Not attempt to access or modify data you are not authorized to
                                access
                            </li>
                            <li>
                                Not use the Service to harass, abuse, or harm other users
                            </li>
                            <li>
                                Not attempt to reverse engineer, decompile, or hack the Service
                            </li>
                            <li>Settle debts in good faith with other group members</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            5. Expense Tracking and Settlements
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium mb-2">5.1 Accuracy</h3>
                                <p className="text-foreground/90">
                                    Even provides tools to track and calculate shared expenses.
                                    While we strive for accuracy, you are responsible for
                                    verifying all calculations and expense records. We are not
                                    liable for errors in expense tracking or debt calculations.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">5.2 Settlements</h3>
                                <p className="text-foreground/90">
                                    Even facilitates settlement tracking and provides integration
                                    with cryptocurrency payments. However, we do not guarantee
                                    that users will fulfill their payment obligations. Disputes
                                    between users must be resolved independently.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">5.3 Payment Processing</h3>
                                <p className="text-foreground/90">
                                    Cryptocurrency payments are processed through the World App
                                    and are subject to blockchain transaction fees and
                                    confirmation times. We are not responsible for failed
                                    transactions, network fees, or delays.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            6. Intellectual Property
                        </h2>
                        <p className="text-foreground/90">
                            The Service, including its design, code, features, and content,
                            is owned by Even and is protected by copyright and other
                            intellectual property laws. You may not copy, modify, distribute,
                            or create derivative works without our express permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            7. Limitation of Liability
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium mb-2">7.1 Service Availability</h3>
                                <p className="text-foreground/90">
                                    We provide the Service on an "as is" and "as available"
                                    basis. We do not guarantee that the Service will be
                                    uninterrupted, secure, or error-free. We reserve the right to
                                    modify, suspend, or discontinue the Service at any time
                                    without notice.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">7.2 Damages</h3>
                                <p className="text-foreground/90">
                                    To the maximum extent permitted by law, Even and its
                                    operators shall not be liable for any indirect, incidental,
                                    special, consequential, or punitive damages, including loss of
                                    profits, data, or other intangible losses resulting from:
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-foreground/90">
                                    <li>Your use or inability to use the Service</li>
                                    <li>Errors or inaccuracies in expense calculations</li>
                                    <li>Unauthorized access to your data</li>
                                    <li>Disputes with other users</li>
                                    <li>Failed or delayed cryptocurrency transactions</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">7.3 Maximum Liability</h3>
                                <p className="text-foreground/90">
                                    Our total liability to you for any claims arising from your
                                    use of the Service shall not exceed the amount you paid to us
                                    in the past 12 months (which is $0 for a free service).
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Indemnification</h2>
                        <p className="text-foreground/90">
                            You agree to indemnify and hold harmless Even and its operators
                            from any claims, damages, losses, liabilities, and expenses
                            (including legal fees) arising from your use of the Service, your
                            violation of these Terms, or your violation of any rights of
                            another user.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            9. Dispute Resolution
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium mb-2">9.1 User Disputes</h3>
                                <p className="text-foreground/90">
                                    Disputes between users regarding expenses, payments, or group
                                    activities must be resolved directly between the parties
                                    involved. Even is not responsible for mediating or resolving
                                    user disputes.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">9.2 Service Disputes</h3>
                                <p className="text-foreground/90">
                                    Any disputes arising from these Terms or your use of the
                                    Service should first be addressed by contacting us at{" "}
                                    <a
                                        href="mailto:support@even-app.com"
                                        className="text-primary hover:underline"
                                    >
                                        support@even-app.com
                                    </a>
                                    . We will attempt to resolve disputes in good faith.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
                        <p className="text-foreground/90">
                            We reserve the right to suspend or terminate your access to the
                            Service at any time, with or without cause, and with or without
                            notice. You may also terminate your account at any time by
                            contacting us. Upon termination, your right to use the Service
                            will immediately cease.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            11. Changes to Terms
                        </h2>
                        <p className="text-foreground/90">
                            We may modify these Terms at any time. We will notify users of
                            material changes by updating the "Last Updated" date. Your
                            continued use of the Service after changes constitutes acceptance
                            of the modified Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
                        <p className="text-foreground/90">
                            These Terms shall be governed by and construed in accordance with
                            applicable international laws. Any legal action or proceeding
                            relating to your use of the Service shall be instituted in a
                            court of competent jurisdiction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">13. Severability</h2>
                        <p className="text-foreground/90">
                            If any provision of these Terms is found to be invalid or
                            unenforceable, the remaining provisions shall continue in full
                            force and effect.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">14. Contact</h2>
                        <p className="text-foreground/90">
                            If you have any questions about these Terms, please contact us at:
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
