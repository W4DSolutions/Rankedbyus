import { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';

export const metadata: Metadata = {
    title: 'Login - RankedByUs',
    description: 'Sign in to access your tactical profile.',
};

export default async function LoginPage(props: { searchParams: Promise<{ next?: string }> }) {
    const searchParams = await props.searchParams;
    const next = searchParams.next;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ArrowLeft size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest hidden sm:block">Back to Registry</span>
                        </Link>
                        <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Tactical Access</h1>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <AuthForm next={next} />
                </div>
            </main>
        </div>
    );
}
