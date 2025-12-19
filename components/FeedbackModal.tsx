"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [type, setType] = useState<'bug' | 'feature' | 'general'>('general');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            alert('Please enter your feedback');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, message, email: email || undefined })
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    // Reset form
                    setType('general');
                    setMessage('');
                    setEmail('');
                    setSubmitted(false);
                }, 2000);
            } else {
                alert('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background w-full max-w-md rounded-3xl p-6 shadow-2xl">
                {submitted ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="font-bold text-xl mb-2">Thank you!</h3>
                        <p className="text-muted-foreground">Your feedback has been submitted.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl">Send Feedback</h3>
                            <button
                                onClick={onClose}
                                className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Type Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setType('bug')}
                                        className={cn(
                                            "py-2 px-3 rounded-xl font-medium text-sm transition-all",
                                            type === 'bug'
                                                ? "bg-red-500 text-white shadow-md"
                                                : "bg-secondary hover:bg-secondary/80"
                                        )}
                                    >
                                        🐛 Bug
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('feature')}
                                        className={cn(
                                            "py-2 px-3 rounded-xl font-medium text-sm transition-all",
                                            type === 'feature'
                                                ? "bg-blue-500 text-white shadow-md"
                                                : "bg-secondary hover:bg-secondary/80"
                                        )}
                                    >
                                        💡 Feature
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('general')}
                                        className={cn(
                                            "py-2 px-3 rounded-xl font-medium text-sm transition-all",
                                            type === 'general'
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "bg-secondary hover:bg-secondary/80"
                                        )}
                                    >
                                        💬 General
                                    </button>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Message *
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what's on your mind..."
                                    required
                                    rows={4}
                                    className="w-full p-3 bg-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>

                            {/* Email (Optional) */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-muted-foreground">
                                    Email (optional)
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full p-3 bg-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="text-xs text-muted-foreground">
                                    We'll only use this to follow up on your feedback
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Feedback'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
