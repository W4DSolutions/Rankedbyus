'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch categories when modal opens
    useEffect(() => {
        if (isOpen && categories.length === 0) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
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
    };

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
        setErrorMessage('');

        try {
            const response = await fetch('/api/submit-tool', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Submission failed');
            }

            setSubmitStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                setFormData({ name: '', website_url: '', description: '', category: categories[0]?.slug || '' });
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
            className={className || "rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"}
        >
            {children || "Submit Tool"}
        </button>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className || "rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"}
            >
                {children || "Submit Tool"}
            </button>

            {isOpen && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="relative w-full max-w-2xl rounded-2xl border border-slate-700/50 bg-slate-900 p-8 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-white">Submit a Tool</h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    Help the community discover great tools! Your submission will be reviewed before going live.
                                </p>
                            </div>

                            {/* Success Message */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">✓</div>
                                        <div>
                                            <div className="font-semibold text-green-400">Submitted successfully!</div>
                                            <div className="text-sm text-green-300/80">
                                                Your tool will appear after admin approval.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {submitStatus === 'error' && (
                                <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">✕</div>
                                        <div>
                                            <div className="font-semibold text-red-400">Submission failed</div>
                                            <div className="text-sm text-red-300/80">
                                                {errorMessage || 'Please try again later'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Tool Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                        Tool Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full rounded-lg border ${formErrors.name ? 'border-red-500' : 'border-slate-600'
                                            } bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                                        placeholder="e.g., ChatGPT, Midjourney"
                                        disabled={isSubmitting}
                                        maxLength={100}
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                                    )}
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formData.name.length}/100 characters
                                    </p>
                                </div>

                                {/* Website URL */}
                                <div>
                                    <label htmlFor="website_url" className="block text-sm font-medium text-white mb-2">
                                        Website URL <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="website_url"
                                        type="url"
                                        value={formData.website_url}
                                        onChange={(e) => handleInputChange('website_url', e.target.value)}
                                        className={`w-full rounded-lg border ${formErrors.website_url ? 'border-red-500' : 'border-slate-600'
                                            } bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                                        placeholder="https://example.com"
                                        disabled={isSubmitting}
                                    />
                                    {formErrors.website_url && (
                                        <p className="mt-1 text-sm text-red-400">{formErrors.website_url}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                                        Category <span className="text-red-400">*</span>
                                    </label>
                                    {isLoadingCategories ? (
                                        <div className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-400">
                                            Loading categories...
                                        </div>
                                    ) : (
                                        <select
                                            id="category"
                                            value={formData.category}
                                            onChange={(e) => handleInputChange('category', e.target.value)}
                                            className={`w-full rounded-lg border ${formErrors.category ? 'border-red-500' : 'border-slate-600'
                                                } bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.slug}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {formErrors.category && (
                                        <p className="mt-1 text-sm text-red-400">{formErrors.category}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        rows={4}
                                        className={`w-full rounded-lg border ${formErrors.description ? 'border-red-500' : 'border-slate-600'
                                            } bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
                                        placeholder="Brief description of what this tool does..."
                                        disabled={isSubmitting}
                                        maxLength={500}
                                    />
                                    {formErrors.description && (
                                        <p className="mt-1 text-sm text-red-400">{formErrors.description}</p>
                                    )}
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formData.description.length}/500 characters
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="flex-1 rounded-lg border border-slate-600 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || submitStatus === 'success'}
                                        className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : submitStatus === 'success' ? (
                                            '✓ Submitted'
                                        ) : (
                                            'Submit Tool'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
}
