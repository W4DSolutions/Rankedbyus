import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MoveRight, ShieldCheck, Users, Target, Rocket } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | RankedByUs - The Methodology",
    description: "Learn how our community-driven ranking algorithm works. Verified user reviews, zero paid placements in organic rankings.",
};

export default function AboutPage() {
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

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-8">
                            <ShieldCheck size={14} />
                            Mission Protocol
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-8">
                            Bringing Order to <br />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">The AI Chaos</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            We built RankedByUs because technical decision-making is broken. SEO-spam, paid listicles, and generic directories have made it impossible to find the best tools. We're fixing that with a meritocratic registry.
                        </p>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">User First</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                Rankings are determined by verified community votes and reviews. No amount of money can buy a higher organic rank.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-6">
                                <Target size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Zero Noise</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                We manually audit every submission. If a tool is vaporware, a wrapper, or low quality, it doesn't get listed.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="h-12 w-12 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center mb-6">
                                <Rocket size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Transparency</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                We clearly label sponsored content. Our revenue model relies on premium placement options, never on manipulating the core data.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team / Story */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-32">
                    <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Who We Are</h2>
                        <p>
                            RankedByUs is maintained by a small team of software engineers and product designers who were tired of scrolling through "Top 10 AI Tools" articles written by bots.
                        </p>
                        <p>
                            We believe that the best way to find software is to ask the people who actually use it. By aggregating community signals (votes, reviews, and traffic), we create a dynamic, living registry of the most valuable assets in the tech stack.
                        </p>
                        <h2 className="text-3xl font-black uppercase tracking-tight mb-6 mt-12">Our Methodology</h2>
                        <p>
                            Our proprietary <strong>"Signal Score"</strong> algorithm ranks tools based on a weighted combination of:
                        </p>
                        <ul>
                            <li><strong>Upvotes:</strong> Direct community endorsement.</li>
                            <li><strong>Recency:</strong> Tools that are actively maintained rank higher.</li>
                            <li><strong>Click-Through Rate:</strong> Actual user interest and intent.</li>
                            <li><strong>Review Quality:</strong> Detailed, verified text reviews carry more weight.</li>
                        </ul>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center px-4 mb-20">
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-blue-600 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                        Get in Touch
                        <MoveRight size={16} />
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
