import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-900 selection:bg-blue-500/30">
            <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <span className="text-xl font-bold text-white">R</span>
                            </div>
                            <h1 className="text-xl font-bold text-white uppercase tracking-tighter">RankedByUs</h1>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-20">
                <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-8">Terms of Service</h1>
                <p className="text-slate-400 mb-12">Last Updated: February 9, 2026</p>

                <div className="prose prose-invert prose-slate max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">1. Acceptable Use</h2>
                        <p className="text-slate-300 leading-relaxed">
                            By accessing RankedByUs, you agree to use the platform for its intended purpose: discovering and ranking AI tools. Spamming, botting votes, or attempting to manipulate rankings will result in a permanent ban.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">2. Tool Submissions</h2>
                        <p className="text-slate-300 leading-relaxed">
                            When you submit a tool, you guarantee that you have the right to share the information and that it is accurate. We reserve the right to reject any submission or edit details without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">3. Content Moderation</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Community reviews are moderated. We do not tolerate offensive language, hate speech, or clearly fake reviews. All approved reviews represent the user's opinion, not ours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">4. Limitation of Liability</h2>
                        <p className="text-slate-300 leading-relaxed">
                            RankedByUs is provided "as is". We are not responsible for the performance or security of any third-party tools listed on our site. Use all external tools at your own risk.
                        </p>
                    </section>

                    <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Questions?</h2>
                        <p className="text-slate-300 mb-4">
                            For legal inquiries regarding our terms, please reach out.
                        </p>
                        <p className="text-blue-400 font-bold tracking-tight">legal@rankedbyus.com</p>Section Id: 2409
                    </section>
                </div>
            </main>
        </div>
    );
}
