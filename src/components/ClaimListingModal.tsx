'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    CheckCircle2,
    ShieldCheck,
    Mail,
    Link as LinkIcon,
    FileText,
    Loader2
} from 'lucide-react';

interface ClaimListingModalProps {
    itemId: string;
    itemName: string;
    className?: string;
    children?: React.ReactNode;
}

export function ClaimListingModal({ itemId, itemName, className, children }: ClaimListingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        email: '',
        proofUrl: '',
        message: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.email.trim()) {
            errors.email = 'Official email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.proofUrl.trim()) {
            errors.proofUrl = 'Verification link is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/tool/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId,
                    ...formData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Claim failed');
            }

            setSubmitStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                setFormData({ email: '', proofUrl: '', message: '' });
                setSubmitStatus('idle');
                setFormErrors({});
            }, 3000);
        } catch (error) {
            console.error('Claim error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    if (!mounted) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className || "w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all relative z-10 active:scale-95"}
            >
                {children || "Claim This Listing"}
            </button>

            {isOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        onClick={() => !isSubmitting && setIsOpen(false)}
                    />

                    <div className="relative w-full max-w-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />

                        <div className="absolute top-0 right-0 p-6">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-10 text-center">
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Founder Onboarding</h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
                                Secure your listing for {itemName}. Claiming allows you to manage metadata and access premium growth tools.
                            </p>
                        </div>

                        {submitStatus === 'success' && (
                            <div className="mb-10 rounded-2xl bg-green-500/10 border border-green-500/20 p-6 text-center animate-in slide-in-from-top-4">
                                <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Protocol Initiated</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    Our auditors will verify your identity within 24-48 hours.
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Official Work Email
                                </label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 pl-12 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-medium"
                                        placeholder="founder@product.com"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Verification Proof (Link)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <LinkIcon size={16} />
                                    </div>
                                    <input
                                        type="url"
                                        required
                                        value={formData.proofUrl}
                                        onChange={(e) => handleInputChange('proofUrl', e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 pl-12 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-medium"
                                        placeholder="Link to LinkedIn, Twitter, or Official Site"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Strategic Intent (Optional)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-5 top-5 text-slate-400">
                                        <FileText size={16} />
                                    </div>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 pl-12 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-medium resize-none"
                                        placeholder="Why should we prioritize your audit?"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || submitStatus === 'success'}
                                className="w-full rounded-2xl bg-slate-900 dark:bg-blue-600 px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Verifying Credentials...
                                    </>
                                ) : submitStatus === 'success' ? (
                                    <>
                                        <CheckCircle2 size={16} />
                                        Claim Submitted
                                    </>
                                ) : (
                                    'Submit Access Request'
                                )}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
