import Link from 'next/link';
import { ThemeToggle } from "@/components/ThemeToggle";

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Privacy Policy</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-12">Last Updated: February 9, 2026</p>

                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">1. Introduction</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            RankedByUs (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">2. Information Collection</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            We collect minimal information to provide our services:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                            <li><strong>Session Identifiers:</strong> We use cookies to track votes and prevents spam.</li>
                            <li><strong>User Content:</strong> Any tools or reviews you submit are stored in our database.</li>
                            <li><strong>Technical Data:</strong> IP addresses and browser types for security and analytics.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">3. Affiliate Disclosure</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Some links on RankedByUs are affiliate links. This means we may earn a small commission if you click them and make a purchase, at no additional cost to you. This helps keep the platform free and verified.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">4. GDPR Compliance</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            For users in the European Economic Area (EEA), we comply with GDPR regulations. You have the right to request access to, correction of, or deletion of your personal data.
                        </p>
                    </section>

                    <section className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Contact Us</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold tracking-tight">legal@rankedbyus.com</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
