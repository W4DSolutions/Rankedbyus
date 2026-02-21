import Link from 'next/link';
import { ThemeToggle } from "@/components/ThemeToggle";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-blue-500/30">
            <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
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
                            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Return to Registry
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-20">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Terms of Service</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-12">Last Updated: February 9, 2026</p>

                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">1. Acceptable Use</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            By accessing RankedByUs, you agree to use the platform for its intended purpose: discovering and ranking AI tools. Spamming, botting votes, or attempting to manipulate rankings will result in a permanent ban.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">2. Tool Submissions</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            When you submit a tool, you guarantee that you have the right to share the information and that it is accurate. We reserve the right to reject any submission or edit details without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">3. Content Moderation</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Community reviews are moderated. We do not tolerate offensive language, hate speech, or clearly fake reviews. All approved reviews represent the user&apos;s opinion, not ours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">4. Limitation of Liability</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            RankedByUs is provided &quot;as is&quot;. We are not responsible for the performance or security of any third-party tools listed on our site. Use all external tools at your own risk.
                        </p>
                    </section>

                    <section className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Questions?</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            For legal inquiries regarding our terms, please reach out.
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold tracking-tight">legal@rankedbyus.com</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
