'use client';

import { useState, useEffect } from 'react';
import { Loader2, DollarSign, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function AdminFinanceStats() {
    const [stats, setStats] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Add a timestamp to bypass any potentially stale browser cache
            const response = await fetch(`/api/admin/stats/finance?t=${Date.now()}`);

            if (response.status === 404) {
                console.error('Finance API Route not found (404)');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setTransactions(data.recentTransactions);
            } else if (response.status === 401) {
                console.warn('Unauthorized access to finance stats');
            }
        } catch (error) {
            console.error('Failed to fetch finance stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Revenue */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={64} />
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                        <DollarSign size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Total Revenue</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">
                        ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                    </div>
                    <div className="mt-1 text-xs font-bold text-slate-500">
                        {stats?.totalTransactions || 0} Paid Submissions
                    </div>
                </div>

                {/* Pending Paid */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                        <AlertCircle size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Paid & Pending</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">
                        {stats?.pendingPaidCount || 0}
                    </div>
                    <div className="mt-1 text-xs font-bold text-slate-500">
                        High Priority Audit
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Recent Transactions</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latest PayPal Payments</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {transactions.length === 0 ? (
                        <p className="text-sm text-slate-400 font-medium">No transactions recorded yet.</p>
                    ) : (
                        transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{tx.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-slate-400">{tx.transaction_id || 'N/A'}</span>
                                            <span className="text-[10px] font-bold text-slate-500">•</span>
                                            <span className="text-[10px] font-bold text-slate-500">{tx.submitter_email || 'No Email'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-slate-900 dark:text-white">
                                        ${Number(tx.payment_amount).toFixed(2)}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {formatDate(tx.created_at)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
