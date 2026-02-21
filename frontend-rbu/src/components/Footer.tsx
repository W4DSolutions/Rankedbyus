import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-32 text-slate-500 dark:text-slate-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-mesh dark:bg-mesh-dark opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start justify-between gap-20 md:gap-40">
                    <div className="flex flex-col items-center md:items-start max-w-md">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 dark:bg-blue-600 shadow-xl group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-black text-white uppercase">R</span>
                            </div>
                            <span className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">RankedByUs</span>
                        </Link>
                        <p className="text-base font-medium text-slate-500 dark:text-slate-400 text-center md:text-left leading-relaxed">
                            The global master registry for ranking tools, apps, and interfaces. Built for technical authority and community validation.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-20 md:gap-32 w-full md:w-auto">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-8">Navigation</h4>
                            <ul className="space-y-6">
                                <li><Link href="/" className="text-[10px] font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Registry</Link></li>
                                <li><Link href="/blog" className="text-[10px] font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Intelligence</Link></li>
                                <li><Link href="/about" className="text-[10px] font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Mission</Link></li>
                                <li><Link href="/contact" className="text-[10px] font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Contact</Link></li>
                                <li><Link href="/advertise" className="text-[10px] font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Advertise</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-8">Legal identity</h4>
                            <ul className="space-y-6">
                                <li><Link href="/privacy" className="text-[10px] font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Privacy</Link></li>
                                <li><Link href="/terms" className="text-[10px] font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Terms</Link></li>
                                <li><a href="#" className="text-[10px] font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Twitter / X</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-32 pt-12 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">© 2026 RankedByUs Intelligence. Authorized Personnel Only.</p>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Protocol: Active</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
