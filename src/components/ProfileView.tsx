
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Star,
    MessageSquare,
    History,
    User,
    Rocket,
    PencilLine,
    TrendingUp,
    ShieldAlert,
    Reply
} from 'lucide-react';
import { ToolCard } from '@/components/ToolCard';
import { ItemWithDetails, ReviewWithItem } from '@/types/models';
import { cn } from '@/lib/utils';
import { ToolIcon } from '@/components/ToolIcon';
import { EditUserToolModal } from '@/components/EditUserToolModal';

interface ProfileViewProps {
    displayName: string;
    displayIdentifier: string;
    isAnonymous: boolean;
    upvotedTools: ItemWithDetails[];
    reviews: ReviewWithItem[];
    submissions: ItemWithDetails[];
    receivedReviews: ReviewWithItem[];
    reputationScore?: number;
}

export function ProfileView({
    displayName,
    displayIdentifier,
    isAnonymous,
    upvotedTools,
    reviews,
    submissions,
    receivedReviews,
    reputationScore = 0
}: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState<'upvoted' | 'reviews' | 'submissions' | 'founder'>('upvoted');
    const [editingTool, setEditingTool] = useState<ItemWithDetails | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(displayName);
    const [currentDisplayName, setCurrentDisplayName] = useState(displayName);
    const [isUpdating, setIsUpdating] = useState(false);

    // Reply state
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayName: newDisplayName }),
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentDisplayName(data.displayName);
                setIsEditingProfile(false);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSendReply = async (reviewId: string) => {
        if (!replyText.trim()) return;
        setIsSendingReply(true);
        try {
            const response = await fetch('/api/user/review-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId, reply: replyText }),
            });
            if (response.ok) {
                setReplyingTo(null);
                setReplyText('');
                // Note: In a real app we'd refresh the data or update local state
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setIsSendingReply(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-12">
            {/* User Summary Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm text-center">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
                        <User size={40} />
                    </div>

                    {isEditingProfile ? (
                        <form onSubmit={handleUpdateProfile} className="mb-4">
                            <input
                                type="text"
                                value={newDisplayName}
                                onChange={(e) => setNewDisplayName(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-center text-sm font-black text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none mb-2"
                                placeholder="Display Name"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingProfile(false)}
                                    className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 py-2 text-[10px] font-black uppercase text-slate-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 rounded-lg bg-blue-600 py-2 text-[10px] font-black uppercase text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Wait...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="group/name relative inline-block w-full">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2 flex items-center justify-center gap-2">
                                {currentDisplayName}
                                {!isAnonymous && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="opacity-0 group-hover/name:opacity-100 p-1 text-slate-400 hover:text-blue-500 transition-all"
                                    >
                                        <PencilLine size={14} />
                                    </button>
                                )}
                            </h2>
                        </div>
                    )}

                    <p className="text-xs font-mono text-slate-400 mb-6 truncate px-4 bg-slate-50 dark:bg-slate-950 py-1 rounded">
                        {displayIdentifier}
                    </p>

                    {!isAnonymous && (
                        <form action="/auth/signout" method="post">
                            <button className="w-full mb-6 rounded-xl bg-slate-200 dark:bg-slate-800 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                Sign Out
                            </button>
                        </form>
                    )}

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <button
                            onClick={() => setActiveTab('upvoted')}
                            className={cn(
                                "p-3 rounded-2xl transition-all flex flex-col items-center gap-1",
                                activeTab === 'upvoted' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className="text-lg font-black">{upvotedTools.length}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">Upvotes</div>
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={cn(
                                "p-3 rounded-2xl transition-all flex flex-col items-center gap-1",
                                activeTab === 'reviews' ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className="text-lg font-black">{reviews.length}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">Signals</div>
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={cn(
                                "p-3 rounded-2xl transition-all flex flex-col items-center gap-1",
                                activeTab === 'submissions' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className="text-lg font-black">{submissions.length}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">Assets</div>
                        </button>
                        <button
                            onClick={() => setActiveTab('founder')}
                            className={cn(
                                "p-3 rounded-2xl transition-all flex flex-col items-center gap-1",
                                activeTab === 'founder' ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20" : "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <div className="text-lg font-black">{receivedReviews.length}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">Intel</div>
                        </button>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 shadow-sm backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <History size={120} />
                    </div>

                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                        <TrendingUp size={14} className="text-blue-500" />
                        Engagement Intensity
                    </h3>

                    <div className="space-y-8">
                        <div>
                            <div className="flex items-end justify-between mb-3">
                                <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                    {reputationScore > 500 ? 'Registry Legend' :
                                        reputationScore > 200 ? 'Senior Analyst' :
                                            reputationScore > 50 ? 'Active Auditor' : 'Verified Member'}
                                </span>
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/5 px-2 py-1 rounded-md uppercase tracking-tight">
                                    Tier {reputationScore > 500 ? 'IV' : reputationScore > 200 ? 'III' : reputationScore > 50 ? 'II' : 'I'}
                                </span>
                            </div>

                            {/* Progress Bar to Next Tier */}
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                                    style={{
                                        width: `${Math.min(100, (reputationScore / (reputationScore > 500 ? 1000 : reputationScore > 200 ? 500 : reputationScore > 50 ? 200 : 50)) * 100)}%`
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reputation Score</span>
                                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{reputationScore.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Since</span>
                                <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Feb 2026</span>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-start gap-3">
                                <ShieldAlert size={14} className="text-blue-500 mt-0.5" />
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    Your reputation is determined by verified audit signals, precise voting activity, and technical asset submissions.
                                    {reputationScore < 50 && " Reach 50 points to unlock Auditor status."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
                {activeTab === 'upvoted' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <Star size={20} className="fill-current" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Endorsed Assets</h2>
                        </div>

                        {upvotedTools.length > 0 ? (
                            <div className="space-y-4">
                                {upvotedTools.map((tool, index) => (
                                    <ToolCard
                                        key={tool.id}
                                        tool={tool}
                                        rank={index + 1}
                                        showCategory
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                                <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                                    <Star size={32} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Endorsements</h3>
                                <p className="mt-2 text-slate-500 font-medium mb-6">Your tactical profile is empty. Signal your support for industry leaders.</p>
                                <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
                                    Explore Registry
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                                <MessageSquare size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Market Signals</h2>
                        </div>

                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                {review.items?.logo_url && (
                                                    <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700 overflow-hidden">
                                                        <ToolIcon
                                                            url={review.items.logo_url}
                                                            name={review.items.name}
                                                            websiteUrl=""
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <Link href={`/tool/${review.items.slug}`} className="text-lg font-black text-slate-900 dark:text-white hover:underline uppercase tracking-tight">
                                                        {review.items.name}
                                                    </Link>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={12}
                                                                className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 dark:text-slate-700"}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border",
                                                review.status === 'approved'
                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                    : review.status === 'pending'
                                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                                                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                            )}>
                                                {review.status}
                                            </span>
                                        </div>
                                        <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 mb-4">
                                            <p className="text-slate-600 dark:text-slate-300 text-sm italic font-medium">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                        {review.owner_reply && (
                                            <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
                                                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                                                    <Reply size={14} className="rotate-180" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Founder Response</span>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                                    {review.owner_reply}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                                <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                                    <MessageSquare size={32} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Audit Signals</h3>
                                <p className="mt-2 text-slate-500 font-medium">You haven't submitted any tactical reviews yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'submissions' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <Rocket size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Strategic Assets</h2>
                        </div>

                        {submissions.length > 0 ? (
                            <div className="space-y-4">
                                {submissions.map((tool) => (
                                    <div key={tool.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm group">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="h-20 w-20 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                <ToolIcon
                                                    url={tool.logo_url}
                                                    name={tool.name}
                                                    websiteUrl={tool.website_url}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{tool.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        {tool.status === 'rejected' && (
                                                            <div className="group/reason relative">
                                                                <ShieldAlert size={16} className="text-red-500 animate-pulse cursor-help" />
                                                                <div className="absolute bottom-full right-0 mb-2 w-64 p-3 rounded-xl bg-slate-900 text-white text-[10px] font-medium opacity-0 group-hover/reason:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl border border-white/10">
                                                                    <div className="font-black uppercase mb-1 text-red-400">Audit Problem Found:</div>
                                                                    {tool.rejection_reason || 'Asset did not meet technical verification standards.'}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <span className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border",
                                                            tool.status === 'approved'
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                                                : tool.status === 'pending'
                                                                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                                        )}>
                                                            {tool.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-6 mt-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Visibility Intensity</span>
                                                        <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white">
                                                            <TrendingUp size={14} className="text-emerald-500" />
                                                            {tool.click_count || 0} Pulse
                                                        </div>
                                                    </div>
                                                    <div className="h-6 w-px bg-slate-100 dark:bg-slate-800" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Intelligence Rank</span>
                                                        <div className="text-sm font-black text-slate-900 dark:text-white">#{tool.score} Alpha</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 mt-6">
                                                    <Link
                                                        href={tool.status === 'approved' ? `/tool/${tool.slug}` : '#'}
                                                        className={cn(
                                                            "text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all",
                                                            tool.status === 'approved'
                                                                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 dark:hover:bg-blue-600 hover:text-white"
                                                                : "bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-700 pointer-events-none"
                                                        )}
                                                    >
                                                        Live View
                                                    </Link>
                                                    <button
                                                        onClick={() => setEditingTool(tool)}
                                                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                    >
                                                        <PencilLine size={14} />
                                                        Update Asset
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                                <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                                    <Rocket size={32} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Registry Empty</h3>
                                <p className="mt-2 text-slate-500 font-medium mb-6">Deploy your first technical asset to the RankedByUs registry.</p>
                                <Link href="/#categories" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                                    Start Submission
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'founder' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Founder Intelligence</h2>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Community feedback stream for your deployed assets.</p>
                            </div>
                            <div className="flex items-center gap-6 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="text-center">
                                    <div className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{receivedReviews.length}</div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inbound Signals</div>
                                </div>
                                <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                                <div className="text-center">
                                    <div className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">
                                        {receivedReviews.filter(r => r.owner_reply).length}
                                    </div>
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Responses</div>
                                </div>
                            </div>
                        </div>

                        {receivedReviews.length > 0 ? (
                            <div className="space-y-6">
                                {receivedReviews.map((review) => (
                                    <div key={review.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm group">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                                    <ToolIcon
                                                        url={review.items.logo_url}
                                                        name={review.items.name}
                                                        websiteUrl=""
                                                        width={32}
                                                        height={32}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Target Asset</div>
                                                    <div className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">{review.items.name}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={cn(
                                                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-100 dark:text-slate-800"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-6">
                                            <div className="flex-1">
                                                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 relative">
                                                    <MessageSquare size={16} className="absolute -left-2 -top-2 text-slate-200 dark:text-slate-800" />
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed">
                                                        "{review.comment}"
                                                    </p>
                                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auditor clearance Level 1</span>
                                                        <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {review.owner_reply ? (
                                                    <div className="mt-6 ml-8 p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                                        <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                                                            <Reply size={16} className="rotate-180" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Your Tactical Response</span>
                                                        </div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-black italic">
                                                            {review.owner_reply}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4 pl-8">
                                                        {replyingTo === review.id ? (
                                                            <div className="animate-in slide-in-from-top-2 duration-300">
                                                                <textarea
                                                                    autoFocus
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    placeholder="Enter your tactical response to this auditor..."
                                                                    className="w-full rounded-2xl border-2 border-blue-100 dark:border-blue-900/40 bg-white dark:bg-slate-900 p-4 text-sm font-medium focus:border-blue-500 focus:outline-none transition-all resize-none shadow-xl"
                                                                    rows={3}
                                                                />
                                                                <div className="flex justify-end gap-3 mt-3">
                                                                    <button
                                                                        onClick={() => setReplyingTo(null)}
                                                                        disabled={isSendingReply}
                                                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                                                    >
                                                                        Abort
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSendReply(review.id)}
                                                                        disabled={isSendingReply || !replyText.trim()}
                                                                        className="rounded-xl bg-blue-600 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                                                                    >
                                                                        {isSendingReply ? 'Broadcasting...' : 'Deploy Response'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setReplyingTo(review.id)}
                                                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                                                            >
                                                                <Reply size={14} className="rotate-180" />
                                                                Issue Response
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                                <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                                    <TrendingUp size={32} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Intelligence Silence</h3>
                                <p className="mt-2 text-slate-500 font-medium">No community signals have been intercepted for your assets yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modals */}
                {editingTool && (
                    <EditUserToolModal
                        tool={editingTool}
                        onClose={() => setEditingTool(null)}
                    />
                )}
            </div>
        </div>
    );
}
