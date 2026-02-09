'use client';

import { useState } from 'react';

export function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage('Welcome to the elite rank! Check your inbox soon.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Try again?');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background elements that adapt to theme */}
            <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-12 md:p-20 backdrop-blur-xl shadow-2xl shadow-blue-500/5 transition-all duration-500">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Weekly Rank Alpha
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6 leading-tight">
                                Built for the <br />
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">Tool-Obsessed</span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                                Join 12,000+ builders getting the "Deep Rank" newsletter. No fluff, just the AI tools that actually moved the needle this week.
                            </p>
                        </div>

                        <div className="relative">
                            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 text-slate-900 dark:text-white shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="rounded-2xl bg-slate-900 dark:bg-blue-600 px-8 py-4 text-sm font-black text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 active:scale-95 whitespace-nowrap"
                                >
                                    {status === 'loading' ? 'Encrypting...' : 'Sub Now'}
                                </button>
                            </form>

                            {message && (
                                <div className={`mt-4 text-sm font-bold animate-in fade-in slide-in-from-top-1 ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="mt-8 flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 flex items-center justify-center text-[10px] font-black text-white">+12k</div>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-500 font-medium italic">
                                    Join the most active tool-ranking community.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
