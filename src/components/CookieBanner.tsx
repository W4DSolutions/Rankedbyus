'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie as CookieIcon, ShieldCheck, Settings, Check, X } from 'lucide-react';

type CookiePreferences = {
    analytics: boolean;
    marketing: boolean;
}

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    const [preferences, setPreferences] = useState<CookiePreferences>({
        analytics: true,
        marketing: true,
    });

    useEffect(() => {
        const consent = localStorage.getItem('rbu_cookie_consent');
        if (!consent) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
        } else {
            try {
                // Try parsing saved preferences if they exist
                const parsed = JSON.parse(consent);
                setPreferences(parsed);
            } catch {
                // if it's just 'accepted', ignore
            }
        }
    }, []);

    const savePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem('rbu_cookie_consent', JSON.stringify(prefs));
        setPreferences(prefs);
        setIsVisible(false);
        setShowPreferences(false);
    };

    const acceptAll = () => {
        savePreferences({ analytics: true, marketing: true });
    };

    const rejectAll = () => {
        savePreferences({ analytics: false, marketing: false });
    };

    const saveSelected = () => {
        savePreferences(preferences);
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-6 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {showPreferences ? (
                /* Preferences Modal */
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-2xl relative">
                        <button onClick={() => setShowPreferences(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-6">
                            <Settings size={28} />
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                Cookie Preferences
                            </h4>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
                            Manage how we use cookies to track your activity. Essential cookies cannot be disabled as they are required for the site to function properly.
                        </p>

                        <div className="space-y-6 mb-8">
                            {/* Essential */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-1">Essential</div>
                                    <div className="text-xs text-slate-500 font-medium">Required for core features and security.</div>
                                </div>
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest opacity-50 flex items-center gap-1">
                                    <Check size={14} /> Always On
                                </div>
                            </div>

                            {/* Analytics */}
                            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-1">Analytics</div>
                                    <div className="text-xs text-slate-500 font-medium">Help us understand how you use RankedByUs.</div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" style={{ backgroundColor: preferences.analytics ? '#2563eb' : '#cbd5e1' }}>
                                    <input type="checkbox" className="sr-only" checked={preferences.analytics} onChange={() => togglePreference('analytics')} />
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.analytics ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </label>

                            {/* Marketing */}
                            <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-1">Marketing</div>
                                    <div className="text-xs text-slate-500 font-medium">Used to deliver personalized content and ads.</div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" style={{ backgroundColor: preferences.marketing ? '#2563eb' : '#cbd5e1' }}>
                                    <input type="checkbox" className="sr-only" checked={preferences.marketing} onChange={() => togglePreference('marketing')} />
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </label>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={rejectAll} className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-900 px-4 py-4 text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all uppercase tracking-widest">
                                Reject All
                            </button>
                            <button onClick={saveSelected} className="flex-1 rounded-xl bg-slate-900 dark:bg-blue-600 px-4 py-4 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest">
                                Save Selection
                            </button>
                            <button onClick={acceptAll} className="flex-1 rounded-xl bg-slate-900 dark:bg-white px-4 py-4 text-xs font-black text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-widest">
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Main Banner */
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

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="hidden lg:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 mr-2">
                                <CookieIcon size={28} strokeWidth={1.5} />
                            </div>

                            <button
                                onClick={() => setShowPreferences(true)}
                                className="w-full sm:w-auto whitespace-nowrap rounded-2xl bg-slate-100 dark:bg-slate-900 px-6 py-4 text-xs font-black text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all uppercase tracking-widest"
                            >
                                Customize
                            </button>

                            <button
                                onClick={acceptAll}
                                className="w-full sm:w-auto whitespace-nowrap rounded-2xl bg-slate-900 dark:bg-blue-600 px-8 py-4 text-xs font-black text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest"
                            >
                                Authorize All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
