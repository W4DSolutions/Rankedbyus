'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    CheckCircle2,
    AlertCircle,
    Plus,
    Globe,
    Layout,
    FileText,
    Loader2,
    Sparkles,
    CreditCard,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
}

interface SubmitToolModalProps {
    className?: string;
    children?: React.ReactNode;
}

export function SubmitToolModal({ className, children }: SubmitToolModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        website_url: '',
        description: '',
        category: '',
        logo_url: '',
        submitter_email: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<'form' | 'payment'>('form');
    const [transactionId, setTransactionId] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
                if (data.categories?.length > 0) {
                    setFormData(prev => ({ ...prev, category: data.categories[0].slug }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch categories when modal opens
    useEffect(() => {
        if (isOpen && categories.length === 0) {
            fetchCategories();
        }
    }, [isOpen, categories.length, fetchCategories]);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Tool name is required';
        } else if (formData.name.length < 2) {
            errors.name = 'Tool name must be at least 2 characters';
        } else if (formData.name.length > 100) {
            errors.name = 'Tool name must be less than 100 characters';
        }

        if (!formData.website_url.trim()) {
            errors.website_url = 'Website URL is required';
        } else {
            try {
                const url = new URL(formData.website_url);
                if (!['http:', 'https:'].includes(url.protocol)) {
                    errors.website_url = 'URL must start with http:// or https://';
                }
            } catch {
                errors.website_url = 'Please enter a valid URL';
            }
        }

        if (!formData.category) {
            errors.category = 'Please select a category';
        }

        if (formData.description && formData.description.length > 500) {
            errors.description = 'Description must be less than 500 characters';
        }

        if (formData.submitter_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitter_email)) {
            errors.submitter_email = 'Please enter a valid email address';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleProceedToPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setStep('payment');
        }
    };

    const handleSubmit = async (txId?: string) => {
        if (!validateForm()) { // Should be valid already, but re-checked
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const payload = {
                ...formData,
                transaction_id: txId || transactionId,
                payment_amount: 2.00,
                payment_status: 'paid'
            };

            const response = await fetch('/api/submit-tool', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Submission failed');
            }

            setSubmitStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                setFormData({ name: '', website_url: '', description: '', category: categories[0]?.slug || '', logo_url: '', submitter_email: '' });
                setStep('form');
                setTransactionId(null); // Explicit reset
                setSubmitStatus('idle');
                setFormErrors({});
            }, 2000);
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to submit tool');
        } finally {
            setIsSubmitting(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePaymentSuccess = (details: any) => {
        const txId = details.id || 'PAYPAL_TX_' + Date.now();
        setTransactionId(txId);
        handleSubmit(txId);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    if (!mounted) return (
        <button
            onClick={() => setIsOpen(true)}
            className={className || "group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800 transition-all uppercase tracking-widest"}
        >
            <Plus size={16} />
            {children || "Submit Tool"}
        </button>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className || "group inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10 active:scale-95 uppercase tracking-widest"}
            >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                {children || "Submit Tool"}
            </button>

            {isOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300 sm:zoom-in-95">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        onClick={() => !isSubmitting && setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <div className="relative w-full max-h-[95vh] flex flex-col md:flex-row rounded-t-[2.5rem] md:rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_0_100px_rgba(37,99,235,0.15)] overflow-hidden animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 duration-500 lg:max-w-5xl md:max-w-4xl mx-auto">

                        {/* Close Button (Global) */}
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                disabled={isSubmitting}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Left Cover / Presentation Panel (Hidden on small screens) */}
                        <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 p-12 flex-col justify-between border-r border-slate-200 dark:border-slate-800 relative overflow-hidden">
                            {/* Decorative background circle */}
                            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
                            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                                    <Globe size={24} className="animate-spin-slow" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Global Registry</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[1.1] mb-6">
                                    Submit<br />To<br />Registry
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                    Position your asset in front of thousands of tactical operators. Every submission undergoes strict manual validation to ensure elite quality.
                                </p>

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Permanent DoFollow Link</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Community Sentiment Analysis</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Algorithmic Placement</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative z-10 mt-12 p-6 rounded-2xl bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-white/20 dark:border-slate-800/50 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShieldCheck size={20} className="text-green-500" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Secure Audit</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">Validation requires a one-time $2.00 setup fee to deter automated spam and fund manual review.</p>
                            </div>
                        </div>

                        {/* Right Form Panel */}
                        <div className="w-full md:w-[60%] p-6 pt-10 md:p-10 lg:p-12 overflow-y-auto relative flex flex-col">
                            {/* Mobile Header (Shows only on mobile) */}
                            <div className="md:hidden mb-8 pr-10">
                                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                    <Globe size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Registry</span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Submit Tool</h2>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    Submit your asset for community validation. Subject to $2.00 manual audit fee.
                                </p>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">

                                {/* Success Message */}
                                {submitStatus === 'success' && (
                                    <div className="mb-10 rounded-2xl bg-green-500/10 border border-green-500/20 p-6 animate-in slide-in-from-top-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Mission Successful</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                    Your tool is now in the audit queue.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {submitStatus === 'error' && (
                                    <div className="mb-10 rounded-2xl bg-red-500/10 border border-red-500/20 p-6 animate-in slide-in-from-top-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20">
                                                <AlertCircle size={24} />
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Transmission Failed</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                    {errorMessage || 'Signal lost. Please try again.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Form */}
                                {step === 'form' ? (
                                    <form onSubmit={handleProceedToPayment} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Tool Name */}
                                            <div>
                                                <label htmlFor="name" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                    Product Identity
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        className={`w-full rounded-2xl border ${formErrors.name ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/10'
                                                            } bg-slate-50 dark:bg-slate-800/50 px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-medium`}
                                                        placeholder="e.g. ChatGPT, Claude"
                                                        disabled={isSubmitting}
                                                        maxLength={100}
                                                    />
                                                </div>
                                                {formErrors.name && (
                                                    <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">{formErrors.name}</p>
                                                )}
                                            </div>

                                            {/* Website URL */}
                                            <div>
                                                <label htmlFor="website_url" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                    Domain Access
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                                        <Globe size={16} />
                                                    </div>
                                                    <input
                                                        id="website_url"
                                                        type="url"
                                                        value={formData.website_url}
                                                        onChange={(e) => handleInputChange('website_url', e.target.value)}
                                                        className={`w-full rounded-2xl border ${formErrors.website_url ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/10'
                                                            } bg-slate-50 dark:bg-slate-800/50 px-5 py-4 pl-12 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-medium`}
                                                        placeholder="https://example.com"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                                {formErrors.website_url && (
                                                    <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">{formErrors.website_url}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Logo URL */}
                                        <div>
                                            <label htmlFor="logo_url" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Visual Identity (Logo URL - Optional)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="logo_url"
                                                    type="url"
                                                    value={formData.logo_url}
                                                    onChange={(e) => handleInputChange('logo_url', e.target.value)}
                                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-medium"
                                                    placeholder="e.g. https://www.google.com/s2/favicons?domain=openai.com&sz=128"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        {/* Email (Optional) */}
                                        <div>
                                            <label htmlFor="submitter_email" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Contact Email (Optional)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="submitter_email"
                                                    type="email"
                                                    value={formData.submitter_email}
                                                    onChange={(e) => handleInputChange('submitter_email', e.target.value)}
                                                    className={`w-full rounded-2xl border ${formErrors.submitter_email ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/10'
                                                        } bg-slate-50 dark:bg-slate-800/50 px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-medium`}
                                                    placeholder="founder@startup.com (For approval notifications)"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            {formErrors.submitter_email && (
                                                <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">{formErrors.submitter_email}</p>
                                            )}
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label htmlFor="category" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Niche Classification
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                    <Layout size={16} />
                                                </div>
                                                {isLoadingCategories ? (
                                                    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 pl-12 text-slate-400 font-medium flex items-center gap-3">
                                                        <Loader2 size={16} className="animate-spin" />
                                                        Scanning Index...
                                                    </div>
                                                ) : (
                                                    <select
                                                        id="category"
                                                        value={formData.category}
                                                        onChange={(e) => handleInputChange('category', e.target.value)}
                                                        className={`w-full rounded-2xl border appearance-none ${formErrors.category ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/10'
                                                            } bg-slate-50 dark:bg-slate-800/50 px-12 py-4 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-bold cursor-pointer`}
                                                        disabled={isSubmitting}
                                                    >
                                                        <option value="">Select Niche...</option>
                                                        {categories.map((cat) => (
                                                            <option key={cat.id} value={cat.slug} className="bg-white dark:bg-slate-900">
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                            {formErrors.category && (
                                                <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">{formErrors.category}</p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label htmlFor="description" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Strategic Analysis (Optional)
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-5 top-5 text-slate-400">
                                                    <FileText size={16} />
                                                </div>
                                                <textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    rows={4}
                                                    className={`w-full rounded-2xl border ${formErrors.description ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/10'
                                                        } bg-slate-50 dark:bg-slate-800/50 px-5 py-4 pl-12 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 transition-all font-medium resize-none`}
                                                    placeholder="What absolute value does this product unlock?"
                                                    disabled={isSubmitting}
                                                    maxLength={500}
                                                />
                                            </div>
                                            {formErrors.description && (
                                                <p className="mt-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">{formErrors.description}</p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-[2] rounded-2xl bg-slate-900 dark:bg-blue-600 px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                Proceed to Audit
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    // Payment Step
                                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700/50">
                                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Review & Audit</span>
                                                <span className="text-sm font-black text-slate-900 dark:text-white">$2.00 USD</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={18} className="text-blue-500" />
                                                    <span className="font-bold text-slate-900 dark:text-white">Total Due</span>
                                                </div>
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">$2.00</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
                                                One-time fee for manual validation and listing processing.
                                            </p>
                                        </div>

                                        <div className="min-h-[150px]">
                                            <PayPalScriptProvider options={{ "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb", currency: "USD" }}>
                                                {isSubmitting ? (
                                                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                                                        <Loader2 size={32} className="animate-spin text-blue-500" />
                                                        <p className="text-sm font-bold text-slate-500">Finalizing Submission...</p>
                                                    </div>
                                                ) : (
                                                    <PayPalButtons
                                                        style={{ layout: "vertical", shape: "rect", borderRadius: 12, label: 'pay' }}
                                                        createOrder={(data, actions) => {
                                                            return actions.order.create({
                                                                intent: 'CAPTURE',
                                                                purchase_units: [
                                                                    {
                                                                        amount: {
                                                                            currency_code: "USD",
                                                                            value: "2.00",
                                                                        },
                                                                        description: `Listing Fee: ${formData.name}`,
                                                                    },
                                                                ],
                                                            });
                                                        }}
                                                        onApprove={async (data, actions) => {
                                                            if (actions.order) {
                                                                const details = await actions.order.capture();
                                                                handlePaymentSuccess(details);
                                                            }
                                                        }}
                                                        onError={(err) => {
                                                            console.error("PayPal Error:", err);
                                                            setErrorMessage("Payment failed. Please try again.");
                                                            setSubmitStatus('error');
                                                        }}
                                                    />
                                                )}
                                            </PayPalScriptProvider>
                                        </div>

                                        <button
                                            onClick={() => setStep('form')}
                                            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            <ArrowLeft size={14} />
                                            Back to details
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
