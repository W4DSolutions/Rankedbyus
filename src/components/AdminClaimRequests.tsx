'use client';

import { useState } from 'react';
import { Check, X, ShieldCheck, Mail, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

interface ClaimRequest {
    id: string;
    item_id: string;
    email: string;
    proof_url: string;
    message: string | null;
    status: string;
    created_at: string;
    items?: { name: string };
}

interface AdminClaimRequestsProps {
    requests: ClaimRequest[];
}

export function AdminClaimRequests({ requests: initialRequests }: AdminClaimRequestsProps) {
    const [requests, setRequests] = useState(initialRequests);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    const handleAction = async (claimId: string, action: 'approve' | 'reject') => {
        setProcessingId(claimId);
        try {
            const res = await fetch('/api/admin/claim-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ claimId, action }),
            });

            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== claimId));
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to process claim:', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-slate-50/50 dark:bg-slate-900/20">
                <ShieldCheck size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Identity Vault Empty</h3>
                <p className="text-sm text-slate-500 font-medium">No pending founder claims require verification.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <div
                    key={request.id}
                    className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm hover:border-blue-500/30 transition-all"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded">
                                    Founder Claim
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {formatDate(request.created_at)}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                                {request.items?.name || 'Unknown Asset'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl">
                                    <Mail size={14} className="text-slate-400" />
                                    {request.email}
                                </div>
                                <a
                                    href={request.proof_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-500/5 p-2 rounded-xl hover:bg-blue-500/10 transition-colors"
                                >
                                    <LinkIcon size={14} />
                                    Verification Proof
                                </a>
                            </div>

                            {request.message && (
                                <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl mb-4 italic text-sm text-slate-500 font-medium">
                                    &quot;{request.message}&quot;
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 ml-6">
                            <button
                                onClick={() => handleAction(request.id, 'approve')}
                                disabled={processingId === request.id}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all disabled:opacity-50"
                            >
                                {processingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} />}
                            </button>
                            <button
                                onClick={() => handleAction(request.id, 'reject')}
                                disabled={processingId === request.id}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                            >
                                {processingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <X size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
