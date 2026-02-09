'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                        <span className="text-2xl font-bold text-white">R</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                    <p className="mt-2 text-slate-400">RankedByUs Control Panel</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Admin Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Verifying...' : 'Login'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Return to Website
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
