'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Trash2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminActionButtonsProps {
    id: string;
}

interface Tag {
    id: string;
    name: string;
    slug: string;
}

export function AdminActionButtons({ id }: AdminActionButtonsProps) {
    const [isProcessing, setIsProcessing] = useState<'approve' | 'reject' | null>(null);
    const [showTagSelector, setShowTagSelector] = useState(false);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);
    const router = useRouter();
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowTagSelector(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchTags = async () => {
        setIsLoadingTags(true);
        try {
            const res = await fetch('/api/tags');
            const data = await res.json();
            if (data.tags) {
                setAvailableTags(data.tags);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setIsLoadingTags(false);
        }
    };

    const handleApproveClick = () => {
        setShowTagSelector(true);
        if (availableTags.length === 0) {
            fetchTags();
        }
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    const handleAction = async (action: 'approve' | 'reject') => {
        if (action === 'reject' && !confirm('Are you sure you want to REJECT this tool?')) return;

        // For approve, we just go ahead
        setIsProcessing(action);
        setShowTagSelector(false);

        try {
            const response = await fetch('/api/admin/tool-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    action,
                    tags: action === 'approve' ? selectedTags : undefined
                }),
            });

            if (response.ok) {
                router.refresh();
            } else {
                const data = await response.json();
                alert(`Error: ${data.error || 'Failed to process action'}`);
            }
        } catch (error) {
            console.error('Action error:', error);
            alert('An unexpected error occurred');
        } finally {
            setIsProcessing(null);
            setSelectedTags([]);
        }
    };

    return (
        <div className="flex gap-2 ml-6 relative">
            {/* Tag Selector Popover */}
            {showTagSelector && (
                <div ref={popoverRef} className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quick Tag</span>
                        <button onClick={() => setShowTagSelector(false)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-1 mb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {isLoadingTags ? (
                            <div className="py-4 text-center text-xs text-slate-400">Loading tags...</div>
                        ) : availableTags.length > 0 ? (
                            availableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTag(tag.id)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between",
                                        selectedTags.includes(tag.id)
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                    )}
                                >
                                    {tag.name}
                                    {selectedTags.includes(tag.id) && <Check size={12} />}
                                </button>
                            ))
                        ) : (
                            <div className="py-2 text-center text-xs text-slate-400">No tags found</div>
                        )}
                    </div>

                    <button
                        onClick={() => handleAction('approve')}
                        className="w-full py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                        Confirm Approval
                    </button>
                </div>
            )}

            <button
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all active:scale-90 disabled:opacity-50"
                onClick={handleApproveClick}
                disabled={isProcessing !== null}
                title="Tag & Approve"
            >
                {isProcessing === 'approve' ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Check size={20} strokeWidth={3} />
                )}
            </button>
            <button
                className="group flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 disabled:opacity-50"
                onClick={() => handleAction('reject')}
                disabled={isProcessing !== null}
                title="Reject Tool"
            >
                {isProcessing === 'reject' ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Trash2 size={18} />
                )}
            </button>
        </div>
    );
}
