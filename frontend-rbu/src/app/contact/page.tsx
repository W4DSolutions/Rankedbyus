import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MoveRight, Mail, Layout, LifeBuoy, Ban } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | RankedByUs Support",
    description: "Submit feedback, inquire about partnerships, or report an issue. We're here to help the community.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-blue-600 shadow-lg group-hover:scale-110 transition-transform">
                                <span className="text-xl font-black text-white uppercase">R</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">RankedByUs</h1>
                        </Link>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link
                                href="/"
                                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                Return to Registry
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-8">
                        Direct <br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">Protocol Line</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        Need support, want to collaborate, or have feedback? Reach out to the appropriate department below.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 hover:shadow-xl transition-all group">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Layout size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Partnerships</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                            For sponsored placements, API access, or brand collaborations.
                        </p>
                        <a href="mailto:partners@rankedbyus.com" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all">
                            partners@rankedbyus.com <MoveRight size={14} />
                        </a>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-green-500/30 hover:shadow-xl transition-all group">
                        <div className="h-12 w-12 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <LifeBuoy size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Support & Feedback</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                            Report a bug, suggest a feature, or ask a general question.
                        </p>
                        <a href="mailto:support@rankedbyus.com" className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all">
                            support@rankedbyus.com <MoveRight size={14} />
                        </a>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-red-500/30 hover:shadow-xl transition-all group">
                        <div className="h-12 w-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <Ban size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Legal & DMCA</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                            Report copyright infringement or request data deletion.
                        </p>
                        <a href="mailto:legal@rankedbyus.com" className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all">
                            legal@rankedbyus.com <MoveRight size={14} />
                        </a>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col justify-center items-center text-center">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Mailing Address</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            RankedByUs HQ<br />
                            123 Innovation Drive<br />
                            San Francisco, CA 94103<br />
                            United States
                        </p>
                    </div>
                </div>

                <div className="bg-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-8">Want to List Your Tool?</h2>
                        <p className="text-blue-100 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
                            Don't use this form. Use our automated submission portal to get your asset audited and ranked by the community.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-2xl bg-white text-blue-600 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95"
                        >
                            Submit Tool <MoveRight size={16} />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
