'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en" className="dark">
            <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6 antialiased">
                <div className="max-w-xl w-full text-center">
                    <div className="relative rounded-[3rem] border border-red-900/30 bg-slate-900/50 p-16 backdrop-blur-3xl shadow-2xl overflow-hidden group">
                        <div className="mx-auto h-24 w-24 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 mb-10 animate-pulse">
                            <AlertTriangle size={48} />
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            Kernel Integrity Failure
                        </div>

                        <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-8">
                            Global <br />
                            <span className="italic text-red-500">Infrastructure Crash</span>
                        </h1>

                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-16">
                            The core application kernel has encountered an unrecoverable exception. The master grid connection has been severed.
                        </p>

                        <button
                            onClick={() => reset()}
                            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-10 py-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-red-500 transition-all shadow-2xl shadow-red-500/20 active:scale-95 group"
                        >
                            <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                            Perform Hard Reboot
                        </button>

                        <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between opacity-50">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                TRACE_ID: {error.digest || 'UNKNOWN'}
                            </div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                SYSTEM_HALTED
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
