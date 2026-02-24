
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MessageSquare, History, User, Rocket, PencilLine } from 'lucide-react';
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
}

export function ProfileView({ displayName, displayIdentifier, isAnonymous, upvotedTools, reviews, submissions }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState<'upvoted' | 'reviews' | 'submissions'>('upvoted');
    const [editingTool, setEditingTool] = useState<ItemWithDetails | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(displayName);
    const [currentDisplayName, setCurrentDisplayName] = useState(displayName);
    const [isUpdating, setIsUpdating] = useState(false);

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

                    <div className="grid grid-cols-3 gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <button
                            onClick={() => setActiveTab('upvoted')}
                            className={cn(
                                "p-2 rounded-xl transition-colors flex flex-col items-center",
                                activeTab === 'upvoted' ? "bg-slate-50 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                        >
                            <div className={cn("text-xl font-black", activeTab === 'upvoted' ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white")}>
                                {upvotedTools.length}
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Upvotes</div>
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={cn(
                                "p-2 rounded-xl transition-colors flex flex-col items-center",
                                activeTab === 'reviews' ? "bg-slate-50 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                        >
                            <div className={cn("text-xl font-black", activeTab === 'reviews' ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white")}>
                                {reviews.length}
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reviews</div>
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={cn(
                                "p-2 rounded-xl transition-colors flex flex-col items-center",
                                activeTab === 'submissions' ? "bg-slate-50 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                        >
                            <div className={cn("text-xl font-black", activeTab === 'submissions' ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white")}>
                                {submissions.length}
                            </div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Added</div>
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 p-6 hidden lg:block">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History size={14} />
                        Recent Upvotes
                    </h3>
                    <div className="space-y-4">
                        {upvotedTools.slice(0, 5).map((tool) => (
                            <div key={tool.id} className="text-sm border-b border-slate-200 dark:border-slate-700/50 pb-2 last:border-0 last:pb-0">
                                <Link href={`/tool/${tool.slug}`} className="font-bold text-slate-900 dark:text-white hover:underline flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                    {tool.name}
                                </Link>
                            </div>
                        ))}
                        {upvotedTools.length === 0 && (
                            <p className="text-sm text-slate-400 italic">No activity yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
                {activeTab === 'upvoted' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                    <Star size={20} className="fill-current" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Endorsed Assets</h2>
                            </div>
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
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Profile Inactive</h3>
                                <p className="mt-2 text-slate-500 font-medium mb-6">Your tactical profile is empty. Start curating your registry to build your reputation.</p>
                                <Link href="/search" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
                                    Explore Registry
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <MessageSquare size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">My Signals</h2>
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
                                        <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                                            <p className="text-slate-600 dark:text-slate-300 text-sm italic font-medium">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                                <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                                    <MessageSquare size={32} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Signals</h3>
                                <p className="mt-2 text-slate-500 font-medium mb-6">You haven't submitted any reviews yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'submissions' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Rocket size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Submitted Assets</h2>
                        </div>

                        {submissions.length > 0 ? (
                            <div className="space-y-4">
                                {submissions.map((tool) => (
                                    <div key={tool.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 p-2">
                                                <ToolIcon
                                                    url={tool.logo_url}
                                                    name={tool.name}
                                                    websiteUrl={tool.website_url}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-4 mb-1">
                                                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{tool.name}</h3>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border whitespace-nowrap",
                                                        tool.status === 'approved'
                                                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                            : tool.status === 'pending'
                                                                ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                                                                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                                    )}>
                                                        {tool.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 truncate mb-3">{tool.website_url}</div>

                                                <div className="flex items-center gap-2 mt-auto">
                                                    <Link
                                                        href={`/tool/${tool.slug}`}
                                                        className="text-[10px] uppercase font-black tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                    >
                                                        View Page
                                                    </Link>
                                                    {!isAnonymous && (
                                                        <button
                                                            onClick={() => setEditingTool(tool)}
                                                            className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                                        >
                                                            <PencilLine size={12} />
                                                            Edit Data
                                                        </button>
                                                    )}
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
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Submissions</h3>
                                <p className="mt-2 text-slate-500 font-medium mb-6">You haven't submitted any tools yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {editingTool && (
                <EditUserToolModal
                    tool={editingTool}
                    onClose={() => setEditingTool(null)}
                />
            )}
        </div>
    );
}
