
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MoveRight, ShieldCheck, Zap, BarChart3, Users, Target } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Advertise on RankedByUs - Reach AI Builders",
    description: "Promote your AI tool to a high-intent audience of developers, creators, and technically savvy early adopters.",
};

export default function AdvertisePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-[40] border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
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

            <main>
                {/* Hero */}
                <section className="relative py-24 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05),transparent)] pointer-events-none" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-8">
                            <Zap size={14} />
                            Partnership Opportunities
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
                            Deploy Your Asset <br />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">To The Front Line</span>
                        </h1>
                        <p className="mx-auto mt-8 max-w-2xl text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            RankedByUs isn't a generic directory. It's a meritocratic registry used by 12,000+ technical buyers, developers, and power users.
                        </p>
                        <div className="mt-12 flex justify-center">
                            <a
                                href="mailto:partners@rankedbyus.com"
                                className="rounded-2xl bg-slate-900 dark:bg-blue-600 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center gap-3"
                            >
                                Contact Sales
                                <MoveRight size={16} />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-12 border-y border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div className="p-6">
                                <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                                    <Users size={24} />
                                </div>
                                <div className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">12k+</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Active Users</div>
                            </div>
                            <div className="p-6 border-l border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-3xl md:rounded-none md:shadow-none md:bg-transparent md:border-y-0">
                                <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                                    <Target size={24} />
                                </div>
                                <div className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">82%</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Decision Makers</div>
                            </div>
                            <div className="p-6">
                                <div className="mx-auto h-12 w-12 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
                                    <BarChart3 size={24} />
                                </div>
                                <div className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">4.8%</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Click-Through Rate</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ad Formats */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Placement Options</h2>
                            <p className="mt-4 text-slate-500 font-medium">Native integration that respects the user experience.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Option 1: Category Sponsor */}
                            <div className="group rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-2xl">
                                <div className="mb-6 h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Category Sponsor</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 h-20">
                                    Secure the top "Featured" banner in your specific niche (e.g., AI Writing). Includes logo, description, and direct CTA.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <span>Highest visibility placement</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <span>Exclusive (1 sponsor per category)</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <span>Visible on Category & Search pages</span>
                                    </li>
                                </ul>
                                <a
                                    href="mailto:partners@rankedbyus.com?subject=Category%20Sponsorship"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Check Availability
                                </a>
                            </div>

                            {/* Option 2: Native List Ad */}
                            <div className="group rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 hover:border-purple-500/30 transition-all shadow-sm hover:shadow-2xl">
                                <div className="mb-6 h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center border border-purple-100 dark:border-purple-800 group-hover:scale-110 transition-transform">
                                    <Zap size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Native Integration</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 h-20">
                                    Appear organically between Rank #3 and #4 in list views. Looks like a tool card but marked as "Promoted".
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <span>High click-through rate</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <span>Contextual relevance</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <span>Cost-effective entry point</span>
                                    </li>
                                </ul>
                                <a
                                    href="mailto:partners@rankedbyus.com?subject=Native%20Ad%20Inquiry"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Get Pricing
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
