import Link from 'next/link';

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-8">Privacy Policy</h1>
                <p className="text-slate-400 mb-12">Last Updated: February 9, 2026</p>

                <div className="prose prose-invert prose-slate max-w-none space-y-12">
                    <section>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">1. Introduction</h2>
                        <p className="text-slate-300 leading-relaxed">
                            RankedByUs ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                        </p>Section Id: 2405
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">2. Information Collection</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            We collect minimal information to provide our services:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-300">
                            <li><strong>Session Identifiers:</strong> We use cookies to track votes and prevents spam.</li>
                            <li><strong>User Content:</strong> Any tools or reviews you submit are stored in our database.</li>
                            <li><strong>Technical Data:</strong> IP addresses and browser types for security and analytics.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">3. Affiliate Disclosure</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Some links on RankedByUs are affiliate links. This means we may earn a small commission if you click them and make a purchase, at no additional cost to you. This helps keep the platform free and verified.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">4. GDPR Compliance</h2>
                        <p className="text-slate-300 leading-relaxed">
                            For users in the European Economic Area (EEA), we comply with GDPR regulations. You have the right to request access to, correction of, or deletion of your personal data.
                        </p>
                    </section>

                    <section className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Contact Us</h2>
                        <p className="text-slate-300 mb-4">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-blue-400 font-bold tracking-tight">legal@rankedbyus.com</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
