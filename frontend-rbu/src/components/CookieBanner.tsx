'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('rbu_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptConsent = () => {
        localStorage.setItem('rbu_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/90 p-6 backdrop-blur-xl shadow-2xl shadow-black/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-white uppercase tracking-widest mb-2">
                            <span className="text-xl">🍪</span>
                            Cookie Policy
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            We use cookies to enhance your ranking experience and analyze site traffic. By clicking "Accept All", you consent to our use of cookies.
                            Read our <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">Privacy Policy</Link> for details.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 gap-3">
                        <button
                            onClick={acceptConsent}
                            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 active:scale-95"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
