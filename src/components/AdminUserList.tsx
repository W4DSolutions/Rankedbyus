'use client';

import { useState, useEffect } from 'react';
import { Loader2, Users, Crown } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function AdminUserList() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<'joined' | 'submissions' | 'votes'>('joined');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (sort === 'joined') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sort === 'submissions') {
            return b.submission_count - a.submission_count;
        } else if (sort === 'votes') {
            return b.vote_count - a.vote_count;
        }
        return 0;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="mr-2">Sort By:</span>
                <button
                    onClick={() => setSort('joined')}
                    className={cn(
                        "px-3 py-1.5 rounded-lg border transition-all",
                        sort === 'joined'
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    Newest
                </button>
                <button
                    onClick={() => setSort('submissions')}
                    className={cn(
                        "px-3 py-1.5 rounded-lg border transition-all",
                        sort === 'submissions'
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    Top Contributors
                </button>
                <button
                    onClick={() => setSort('votes')}
                    className={cn(
                        "px-3 py-1.5 rounded-lg border transition-all",
                        sort === 'votes'
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    Most Active
                </button>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User Identity</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Submissions</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Votes</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {sortedUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                <Users size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {user.email}
                                                </div>
                                                <div className="text-[10px] font-mono text-slate-400">
                                                    {user.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' || user.email?.includes('admin') ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                                                <Crown size={10} className="fill-current text-purple-500/20" /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "font-bold text-sm",
                                            user.submission_count > 0 ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-600"
                                        )}>
                                            {user.submission_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "font-bold text-sm",
                                            user.vote_count > 0 ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-600"
                                        )}>
                                            {user.vote_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {formatDate(user.created_at)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {sortedUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                        No users found in database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
