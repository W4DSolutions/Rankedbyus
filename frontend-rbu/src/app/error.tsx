'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, Terminal } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Runtime Error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 p-6">
            <div className="max-w-xl w-full">
                <div className="relative rounded-[3rem] border border-red-200 dark:border-red-900/30 bg-white dark:bg-slate-900/50 p-12 md:p-16 backdrop-blur-3xl shadow-2xl overflow-hidden group">
                    {/* Tactical background detail */}
                    <div className="absolute -right-12 -top-12 text-red-500/5 font-black text-9xl italic pointer-events-none group-hover:text-red-500/10 transition-colors">
                        ERR_INTEL
                    </div>

                    <div className="relative z-10 text-center">
                        <div className="mx-auto h-20 w-20 rounded-3xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 mb-8 animate-pulse">
                            <AlertTriangle size={40} />
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Critical Runtime Fault
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
                            Intelligence <br />
                            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent italic">Sync Failure</span>
                        </h1>

                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12">
                            A disruptive signal has compromised the terminal interface. The encrypted payload could not be decrypted for deployment.
                        </p>

                        {error.digest && (
                            <div className="mb-12 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                                Transaction ID: {error.digest}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => reset()}
                                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-red-600 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-red-500 transition-all shadow-xl shadow-red-500/10 active:scale-95 group/btn"
                            >
                                <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                                Reboot Terminal
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                            >
                                <Home size={16} />
                                Exit to Master Grid
                            </Link>
                        </div>
                    </div>

                    {/* Terminal footer detail */}
                    <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <Terminal size={12} />
                            Status: Diagnostics Active
                        </div>
                        <div className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                            Build: 2026.RBU.ALPHA
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
