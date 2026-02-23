'use client';

// Force refresh


import { useState, useEffect } from 'react';
import {
    Pencil,
    Trash2,
    Save,
    X,
    Loader2,
    Plus,
    FileText,
    Eye,
    EyeOff,
    User,
    Calendar,
    Link as LinkIcon,
    ArrowUpRight
} from 'lucide-react';
import type { Article, Item } from '@/types/models';
import { cn, formatDate } from '@/lib/utils';

interface AdminArticleListProps {
    initialArticles: Article[];
    items: Item[]; // To link articles to tools
}

export function AdminArticleList({ initialArticles, items }: AdminArticleListProps) {
    const [articles, setArticles] = useState(initialArticles);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Article>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Create Article State
    const [isCreating, setIsCreating] = useState(false);
    const [newArticle, setNewArticle] = useState<Partial<Article>>({
        is_published: false,
        author_name: 'RankedByUs Team',
        published_at: null
    });

    const startEditing = (article: Article) => {
        setEditingId(article.id);
        setEditForm({
            title: article.title,
            excerpt: article.excerpt || '',
            content: article.content,
            item_id: article.item_id || '',
            author_name: article.author_name || '',
            is_published: article.is_published,
            published_at: article.published_at
        });
    };

    const handleCreate = async () => {
        if (!newArticle.title || !newArticle.content) {
            alert('Title and Content are required');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArticle)
            });

            const data = await response.json();

            if (response.ok) {
                setArticles([data.article, ...articles]);
                setIsCreating(false);
                setNewArticle({
                    is_published: false,
                    author_name: 'RankedByUs Team'
                });
            } else {
                alert(data.error || 'Failed to create article');
            }
        } catch (err) {
            alert('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async (id: string) => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/articles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const data = await response.json();
                setArticles(articles.map(a => a.id === id ? { ...a, ...data.article } : a));
                setEditingId(null);
            } else {
                alert('Failed to save changes');
            }
        } catch (err) {
            alert('Something went wrong');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            const response = await fetch(`/api/admin/articles/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setArticles(articles.filter(a => a.id !== id));
            }
        } catch (err) {
            alert('Deletion failed');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <FileText size={18} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Content Hub</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl">
                        {articles.length} Deep Dives
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-purple-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-purple-500 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={14} />
                        New Article
                    </button>
                </div>
            </div>

            {isCreating && (
                <div className="rounded-2xl border border-purple-500 bg-purple-50/50 dark:bg-purple-900/10 p-6 shadow-sm mb-6 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Draft New Intelligence</h3>
                        <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Headline *</label>
                                <input
                                    type="text"
                                    value={newArticle.title || ''}
                                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                                    placeholder="Enter compelling title..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Link to Asset</label>
                                <select
                                    value={newArticle.item_id || ''}
                                    onChange={(e) => setNewArticle({ ...newArticle, item_id: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                                >
                                    <option value="">General Article (No Tool)</option>
                                    {items.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Author Name</label>
                                <input
                                    type="text"
                                    value={newArticle.author_name || ''}
                                    onChange={(e) => setNewArticle({ ...newArticle, author_name: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex flex-col gap-4 h-full pt-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newArticle.is_published || false}
                                        onChange={(e) => setNewArticle({
                                            ...newArticle,
                                            is_published: e.target.checked,
                                            published_at: e.target.checked && !newArticle.published_at ? new Date().toISOString() : newArticle.published_at
                                        })}
                                        className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publish Status</span>
                                </label>

                                {newArticle.is_published && (
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Schedule Date (UTC)</label>
                                        <input
                                            type="datetime-local"
                                            value={newArticle.published_at ? new Date(newArticle.published_at).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => setNewArticle({ ...newArticle, published_at: new Date(e.target.value).toISOString() })}
                                            className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-2 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Excerpt / Hook</label>
                            <textarea
                                value={newArticle.excerpt || ''}
                                onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                                className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-medium border border-slate-200 dark:border-slate-800 focus:ring-2 ring-purple-500/20 focus:border-purple-500 focus:outline-none"
                                rows={2}
                                placeholder="Short summary for the index..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Content (Markdown Supported) *</label>
                            <textarea
                                value={newArticle.content || ''}
                                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                                className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-medium border border-slate-200 dark:border-slate-800 focus:ring-2 ring-purple-500/20 focus:border-purple-500 focus:outline-none font-mono"
                                rows={10}
                                placeholder="# The Deep Dive..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={isSaving}
                                className="px-8 py-3 rounded-xl bg-purple-600 text-[10px] font-black uppercase text-white hover:bg-purple-500 shadow-lg"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Store Knowledge'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className={cn(
                            "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-all",
                            editingId === article.id ? "ring-2 ring-purple-500 border-transparent" : "hover:border-purple-500/20"
                        )}
                    >
                        {editingId === article.id ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Headline</label>
                                        <input
                                            type="text"
                                            value={editForm.title || ''}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Linked Asset</label>
                                        <select
                                            value={editForm.item_id || ''}
                                            onChange={(e) => setEditForm({ ...editForm, item_id: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-bold"
                                        >
                                            <option value="">General Article</option>
                                            {items.map(item => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Author</label>
                                        <input
                                            type="text"
                                            value={editForm.author_name || ''}
                                            onChange={(e) => setEditForm({ ...editForm, author_name: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4 pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={editForm.is_published || false}
                                                onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked })}
                                                className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Published</span>
                                        </label>

                                        {editForm.is_published && (
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Schedule Date</label>
                                                <input
                                                    type="datetime-local"
                                                    value={editForm.published_at ? new Date(editForm.published_at).toISOString().slice(0, 16) : ''}
                                                    onChange={(e) => setEditForm({ ...editForm, published_at: new Date(e.target.value).toISOString() })}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 text-sm font-bold border border-slate-200 dark:border-slate-700"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Content (Markdown)</label>
                                    <textarea
                                        value={editForm.content || ''}
                                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-medium font-mono"
                                        rows={12}
                                    />
                                </div>

                                <div className="flex gap-3 justify-end pt-4">
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-6 py-3 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSave(article.id)}
                                        disabled={isSaving}
                                        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-3 text-[10px] font-black uppercase text-white hover:bg-purple-500 transition-all shadow-xl shadow-purple-500/20"
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                                        Update Intelligence
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={cn(
                                        "h-12 w-12 flex-shrink-0 rounded-xl flex items-center justify-center p-3 shadow-sm",
                                        article.is_published ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                    )}>
                                        {article.is_published ? <Eye size={24} /> : <EyeOff size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{article.title}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-2">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                <User size={12} />
                                                {article.author_name}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                <Calendar size={12} />
                                                {formatDate(article.published_at || article.created_at)}
                                                {article.published_at && new Date(article.published_at) > new Date() && (
                                                    <span className="ml-1 text-orange-500">(Scheduled)</span>
                                                )}
                                            </div>
                                            {article.item_id && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                                                    <LinkIcon size={12} />
                                                    Linked to Asset
                                                </div>
                                            )}
                                            {article.is_published && (
                                                <a
                                                    href={`/article/${article.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-[9px] font-black text-purple-600 uppercase tracking-widest hover:underline"
                                                >
                                                    <ArrowUpRight size={12} />
                                                    View Live
                                                </a>
                                            )}
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                <Eye size={12} className="text-blue-500" />
                                                {article.view_count || 0} Views
                                            </div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {article.content.length} chars
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end md:self-center">
                                    <button
                                        onClick={() => startEditing(article)}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-purple-600 transition-all"
                                        title="Edit Article"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all"
                                        title="Delete Article"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {articles.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Archives Empty</h3>
                        <p className="mt-2 text-sm text-slate-500 font-medium">No deep-dive articles found in the registry.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
