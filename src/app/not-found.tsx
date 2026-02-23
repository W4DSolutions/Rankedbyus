import Link from "next/link";
import { Search, Home, ArrowLeft, Grid } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 p-6">
            <div className="max-w-2xl w-full">
                <div className="relative rounded-[4rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-16 md:p-24 backdrop-blur-3xl shadow-2xl overflow-hidden group text-center">
                    {/* Background visual detail */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-50" />
                    <div className="absolute -right-16 -top-16 text-slate-900 dark:text-white opacity-[0.03] font-black text-[200px] italic pointer-events-none select-none">
                        404
                    </div>

                    <div className="relative z-10">
                        <div className="mx-auto h-24 w-24 rounded-3xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 mb-10 shadow-inner">
                            <Search size={48} strokeWidth={1.5} />
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            Coordinate Failure
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-8">
                            Signals <br />
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent italic">Dissipated</span>
                        </h1>

                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-16 max-w-md mx-auto">
                            The requested intelligence coordinate does not exist within the master registry. The link may have been decommissioned.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-blue-600 px-10 py-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20 active:scale-95 group/btn"
                            >
                                <Home size={16} />
                                Return Home
                            </Link>
                            <Link
                                href="/search"
                                className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                            >
                                <Grid size={16} />
                                Global Registry
                            </Link>
                        </div>

                        <div className="mt-20">
                            <Link
                                href="/#categories"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                            >
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                Browse Operational Sektors
                            </Link>
                        </div>
                    </div>

                    {/* Footer Detail */}
                    <div className="absolute inset-x-0 bottom-0 py-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 px-12 flex items-center justify-between pointer-events-none">
                        <div className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none">
                            ERR:404_NULL_COORDINATE
                        </div>
                        <div className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest leading-none">
                            LAT: 0.00 / LON: 0.00
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
