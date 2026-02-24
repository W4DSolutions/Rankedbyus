'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NewsletterDispatchButton() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleDispatch = async () => {
        if (!confirm('Are you ready to broadcast the Weekly Signal to all active subscribers?')) return;

        setStatus('sending');
        try {
            const res = await fetch('/api/admin/newsletter/send-digest', {
                method: 'POST',
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Signal transmitted successfully.');
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Transmission failed.');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error during broadcast.');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
                onClick={handleDispatch}
                disabled={status === 'sending'}
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all shadow-lg active:scale-95 disabled:opacity-50",
                    status === 'idle' && "bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-500",
                    status === 'sending' && "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed",
                    status === 'success' && "bg-emerald-500 text-white",
                    status === 'error' && "bg-red-500 text-white"
                )}
            >
                {status === 'sending' ? (
                    <>
                        <Loader2 size={12} className="animate-spin" />
                        Transmitting...
                    </>
                ) : status === 'success' ? (
                    <>
                        <CheckCircle2 size={12} />
                        Signal Broadcasted
                    </>
                ) : status === 'error' ? (
                    <>
                        <AlertCircle size={12} />
                        Signal Lost
                    </>
                ) : (
                    <>
                        <Send size={12} />
                        Dispatch Signal
                    </>
                )}
            </button>
            {message && (
                <p className={cn(
                    "mt-2 text-[9px] font-black uppercase text-center tracking-widest",
                    status === 'success' ? "text-emerald-500" : "text-red-500"
                )}>
                    {message}
                </p>
            )}
        </div>
    );
}
