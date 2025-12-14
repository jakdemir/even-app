import { cn } from "@/lib/utils";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                <p className="text-sm text-muted-foreground mb-8">
                    Last Updated: December 14, 2025
                </p>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-foreground/90">
                            By accessing and using Even ("the Service"), you accept and agree
                            to be bound by these Terms of Service ("Terms"). If you do not
                            agree to these Terms, please do not use the Service. Your use of
                            the Service constitutes your acceptance of these Terms, including
                            all limitations of liability and disclaimers of warranties.
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
                            a Mini App within the World App ecosystem. <strong>The Service is
                                provided for informational and convenience purposes only and should
                                not be relied upon as the sole basis for financial decisions.</strong>
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
                                    <strong>WE MAKE NO REPRESENTATIONS OR WARRANTIES REGARDING THE
                                        ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CALCULATIONS.</strong>
                                    You are solely responsible for verifying all calculations and
                                    expense records. We are not liable for any errors, omissions,
                                    or inaccuracies in expense tracking, debt calculations, or any
                                    financial losses resulting therefrom.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">5.2 Settlements</h3>
                                <p className="text-foreground/90">
                                    Even facilitates settlement tracking and provides integration
                                    with cryptocurrency payments. <strong>WE DO NOT GUARANTEE THAT
                                        USERS WILL FULFILL THEIR PAYMENT OBLIGATIONS.</strong> We are not
                                    a party to any agreements between users. All disputes between
                                    users must be resolved independently. We have no obligation to
                                    mediate, arbitrate, or otherwise resolve disputes, and we
                                    expressly disclaim any liability for unpaid debts or failed
                                    settlements.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">5.3 Payment Processing</h3>
                                <p className="text-foreground/90">
                                    Cryptocurrency payments are processed through the World App
                                    and are subject to blockchain transaction fees, confirmation
                                    times, and network congestion. <strong>WE ARE NOT RESPONSIBLE FOR
                                        FAILED TRANSACTIONS, NETWORK FEES, DELAYS, LOST FUNDS, OR ANY
                                        OTHER ISSUES RELATED TO CRYPTOCURRENCY TRANSACTIONS.</strong> You
                                    acknowledge that cryptocurrency transactions are irreversible
                                    and assume all risks associated with such transactions.
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
                                    basis <strong>WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR
                                        IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                                        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                                        NON-INFRINGEMENT.</strong> We do not guarantee that the Service
                                    will be uninterrupted, secure, error-free, or free from viruses
                                    or other harmful components. We reserve the right to modify,
                                    suspend, or discontinue the Service at any time without notice
                                    or liability.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">7.2 Damages</h3>
                                <p className="text-foreground/90">
                                    <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, EVEN AND ITS
                                        OPERATORS, AFFILIATES, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE
                                        FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                                        PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                                        DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-foreground/90">
                                    <li>Your use or inability to use the Service</li>
                                    <li>Any errors, mistakes, or inaccuracies in expense calculations</li>
                                    <li>Unauthorized access to your data or account</li>
                                    <li>Any interruption or cessation of the Service</li>
                                    <li>Disputes with other users or unpaid debts</li>
                                    <li>Failed, delayed, or incorrect cryptocurrency transactions</li>
                                    <li>Loss of funds due to user error or technical issues</li>
                                    <li>Any bugs, viruses, or malicious code</li>
                                    <li>Any third-party content or conduct</li>
                                    <li>Any other matter relating to the Service</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">7.3 Maximum Liability</h3>
                                <p className="text-foreground/90">
                                    <strong>IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ANY
                                        CLAIMS ARISING FROM YOUR USE OF THE SERVICE EXCEED THE AMOUNT
                                        YOU PAID TO US IN THE PAST 12 MONTHS, WHICH IS $0 USD FOR A
                                        FREE SERVICE.</strong> This limitation applies regardless of the
                                    legal theory upon which the claim is based.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Indemnification</h2>
                        <p className="text-foreground/90">
                            <strong>You agree to indemnify, defend, and hold harmless Even and
                                its operators, affiliates, employees, agents, and licensors from
                                any and all claims, demands, damages, losses, liabilities, costs,
                                and expenses (including reasonable attorney's fees)</strong> arising
                            from or relating to: (a) your use of the Service; (b) your violation
                            of these Terms; (c) your violation of any rights of another user or
                            third party; (d) any disputes between you and other users; (e) any
                            inaccurate or fraudulent information you provide; or (f) your
                            violation of any applicable laws or regulations.
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
                        <h2 className="text-xl font-semibold mb-3">
                            10. Class Action Waiver and Arbitration
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium mb-2">10.1 Class Action Waiver</h3>
                                <p className="text-foreground/90">
                                    <strong>YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL
                                        BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS,
                                        CONSOLIDATED, OR REPRESENTATIVE ACTION.</strong> You waive any
                                    right to participate in a class action lawsuit or class-wide
                                    arbitration against Even.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">10.2 Binding Arbitration</h3>
                                <p className="text-foreground/90">
                                    Any dispute, claim, or controversy arising out of or relating
                                    to these Terms or your use of the Service shall be settled by
                                    binding arbitration, rather than in court, except that you may
                                    assert claims in small claims court if your claims qualify. The
                                    arbitration shall be conducted in accordance with applicable
                                    arbitration rules. <strong>YOU WAIVE YOUR RIGHT TO A JURY
                                        TRIAL.</strong>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">11. Termination</h2>
                        <p className="text-foreground/90">
                            We reserve the right to suspend or terminate your access to the
                            Service at any time, with or without cause, and with or without
                            notice. You may also terminate your account at any time by
                            contacting us. Upon termination, your right to use the Service
                            will immediately cease. <strong>We shall not be liable to you or
                                any third party for any termination of your access to the
                                Service.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">
                            12. Changes to Terms
                        </h2>
                        <p className="text-foreground/90">
                            We may modify these Terms at any time. We will notify users of
                            material changes by updating the "Last Updated" date. Your
                            continued use of the Service after changes constitutes acceptance
                            of the modified Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">13. Governing Law</h2>
                        <p className="text-foreground/90">
                            These Terms shall be governed by and construed in accordance with
                            applicable international laws. Any legal action or proceeding
                            relating to your use of the Service shall be instituted in a
                            court of competent jurisdiction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">14. Severability</h2>
                        <p className="text-foreground/90">
                            If any provision of these Terms is found to be invalid or
                            unenforceable, the remaining provisions shall continue in full
                            force and effect.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">15. Contact</h2>
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
