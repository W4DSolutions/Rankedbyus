'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie as CookieIcon, ShieldCheck } from 'lucide-react';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('rbu_cookie_consent');
        if (!consent) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
        }
    }, []);

    const acceptConsent = () => {
        localStorage.setItem('rbu_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-6 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 dark:text-blue-400 mb-2">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Privacy Protocol</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
                            Audit Consent
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            We utilize tactical cookies to optimize your ranking journey and secure the registry. Your interactions remain anonymous.
                            Review our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">Privacy Framework</Link>.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500">
                            <CookieIcon size={28} strokeWidth={1.5} />
                        </div>

                        <button
                            onClick={acceptConsent}
                            className="whitespace-nowrap rounded-2xl bg-slate-900 dark:bg-blue-600 px-10 py-4 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest"
                        >
                            Authorize All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
