'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, Rocket, Save } from 'lucide-react';
import { ItemWithDetails } from '@/types/models';
import { cn } from '@/lib/utils';
import { ToolIcon } from './ToolIcon';

interface EditUserToolModalProps {
    tool: ItemWithDetails;
    onClose: () => void;
}

export function EditUserToolModal({ tool, onClose }: EditUserToolModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: tool.name || '',
        description: tool.description || '',
        website_url: tool.website_url || '',
        logo_url: tool.logo_url || '',
        pricing_model: tool.pricing_model || 'freemium',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.website_url) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/user/tool', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: tool.id,
                    ...formData
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update listing');
            }

            setSubmitStatus('success');
            setTimeout(() => {
                onClose();
                router.refresh();
            }, 2000);
        } catch (error) {
            console.error('Update error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={!isSubmitting ? onClose : undefined}
            ></div>

            {/* Modal Panel */}
            <div className="relative w-full max-w-2xl transform overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl transition-all border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600 dark:text-blue-400">
                            <Rocket size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter" id="modal-title">
                                Edit Listing
                            </h3>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                                Update Data for {tool.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-500 transition-colors disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="overflow-y-auto p-6 sm:p-8 shrink min-h-0">
                    {submitStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-500">
                            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Update Secured</h4>
                            <p className="text-slate-500 font-medium">The listing data has been successfully updated on the RankedByUs registry.</p>
                        </div>
                    ) : (
                        <form id="edit-tool-form" onSubmit={handleSubmit} className="space-y-6">
                            {submitStatus === 'error' && (
                                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 text-sm text-red-600 dark:text-red-400 font-medium animate-in slide-in-from-top-2">
                                    Failed to apply updates. Ensure you have the proper authorizations.
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                                        Listing Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Website URL */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="website_url" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                                        Website URL
                                    </label>
                                    <input
                                        type="url"
                                        id="website_url"
                                        value={formData.website_url}
                                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                        className="block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Logo URL */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="logo_url" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2 flex items-center justify-between">
                                        <span>Logo URL</span>
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 p-2 overflow-hidden flex items-center justify-center text-slate-400">
                                            {formData.logo_url || formData.website_url ? (
                                                <ToolIcon
                                                    url={formData.logo_url}
                                                    name={formData.name || 'Preview'}
                                                    websiteUrl={formData.website_url}
                                                    width={32}
                                                    height={32}
                                                />
                                            ) : (
                                                <span className="text-[10px] uppercase font-bold">Prev</span>
                                            )}
                                        </div>
                                        <input
                                            type="url"
                                            id="logo_url"
                                            value={formData.logo_url}
                                            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                            placeholder="Leave blank to auto-fetch from website"
                                            className="block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Pricing Model */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="pricing_model" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
                                        Base Pricing Model
                                    </label>
                                    <select
                                        id="pricing_model"
                                        value={formData.pricing_model || 'freemium'}
                                        onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value })}
                                        className="block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors cursor-pointer"
                                    >
                                        <option value="free">100% Free</option>
                                        <option value="freemium">Freemium (Free Tier Available)</option>
                                        <option value="paid">Paid / Premium Only</option>
                                        <option value="enterprise">Enterprise / Contact for Pricing</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="description" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2 flex justify-between">
                                        <span>Elevator Pitch / Description</span>
                                        <span className={cn(
                                            "font-mono transition-colors",
                                            formData.description.length > 200 ? "text-yellow-500" : "text-slate-400"
                                        )}>
                                            {formData.description.length}/300
                                        </span>
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        maxLength={300}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="block w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none"
                                        placeholder="Briefly describe the key benefits and features of this tool..."
                                    />
                                    <p className="mt-2 text-[11px] text-slate-500 font-medium">
                                        Keep it punchy. SEO description shown on the registry card.
                                    </p>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-tool-form"
                        disabled={isSubmitting || submitStatus === 'success'}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-blue-500/20"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Updating...
                            </>
                        ) : submitStatus === 'success' ? (
                            <>
                                <CheckCircle2 size={16} />
                                Secured
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Apply Updates
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
