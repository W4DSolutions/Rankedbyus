'use client';

import { useState } from 'react';
import { ToolIcon } from '@/components/ToolIcon';
import {
    Pencil,
    Trash2,
    ExternalLink,
    Save,
    X,
    Loader2,
    Check,
    TrendingUp,
    Shield,
    Plus,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import type { ItemWithDetails, Category } from '@/types/models';
import { cn, getLogoUrl } from '@/lib/utils';
import Image from 'next/image';

interface AdminAssetListProps {
    initialAssets: ItemWithDetails[];
    categories: Category[];
}

export function AdminAssetList({ initialAssets, categories }: AdminAssetListProps) {
    const [assets, setAssets] = useState(initialAssets);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<ItemWithDetails>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Create Asset State
    const [isCreating, setIsCreating] = useState(false);
    const [newAsset, setNewAsset] = useState<Partial<ItemWithDetails>>({
        pricing_model: 'Freemium',
        category_id: categories[0]?.id || ''
    });
    const [enrichingId, setEnrichingId] = useState<string | null>(null);

    const startEditing = (asset: ItemWithDetails) => {
        setEditingId(asset.id);
        setEditForm({
            name: asset.name,
            description: asset.description,
            affiliate_link: asset.affiliate_link || '',
            website_url: asset.website_url || '',
            pricing_model: (asset as any).pricing_model || 'Freemium',
            category_id: asset.category_id,
            is_sponsored: asset.is_sponsored || false,
            sponsored_until: asset.sponsored_until || '',
            is_verified: asset.is_verified || false
        });
    };

    const handleCreate = async () => {
        if (!newAsset.name || !newAsset.website_url || !newAsset.category_id) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAsset)
            });

            const data = await response.json();

            if (response.ok) {
                setAssets([data.asset, ...assets]);
                setIsCreating(false);
                setNewAsset({
                    pricing_model: 'Freemium',
                    category_id: categories[0]?.id || ''
                });
            } else {
                alert(data.error || 'Failed to create asset');
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
            // We'll need an API for this
            const response = await fetch(`/api/admin/assets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const data = await response.json();
                setAssets(assets.map(a => a.id === id ? { ...a, ...data.asset } : a));
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
        if (!confirm('Are you sure you want to delete this asset from the registry?')) return;

        try {
            const response = await fetch(`/api/admin/assets/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setAssets(assets.filter(a => a.id !== id));
            }
        } catch (err) {
            alert('Deletion failed');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Shield size={18} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Approved Registry</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl">
                        {assets.length} Live Assets
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search registry by name or niche..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900/50 rounded-xl px-6 py-4 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all pl-12"
                    />
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-blue-600 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                >
                    <Plus size={14} />
                    Add Asset
                </button>
            </div>

            {isCreating && (
                <div className="rounded-2xl border border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 p-6 shadow-sm mb-6 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">New Registry Entry</h3>
                        <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Asset Name *</label>
                                <input
                                    type="text"
                                    value={newAsset.name || ''}
                                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                                    placeholder="e.g. ChatGPT"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category *</label>
                                <select
                                    value={newAsset.category_id || ''}
                                    onChange={(e) => setNewAsset({ ...newAsset, category_id: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Website URL *</label>
                                <input
                                    type="url"
                                    value={newAsset.website_url || ''}
                                    onChange={(e) => setNewAsset({ ...newAsset, website_url: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pricing Model</label>
                                <select
                                    value={newAsset.pricing_model || 'Freemium'}
                                    onChange={(e) => setNewAsset({ ...newAsset, pricing_model: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 focus:ring-2 ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                                >
                                    <option>Free</option>
                                    <option>Freemium</option>
                                    <option>Paid</option>
                                    <option>Trial</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="new-is-verified"
                                    checked={newAsset.is_verified || false}
                                    onChange={(e) => setNewAsset({ ...newAsset, is_verified: e.target.checked })}
                                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="new-is-verified" className="text-[10px] font-black text-blue-600 uppercase tracking-widest cursor-pointer">
                                    Founder Verified Status
                                </label>
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (!newAsset.name || !newAsset.website_url) {
                                            alert("Enter Name and URL first to use AI");
                                            return;
                                        }
                                        setIsSaving(true);
                                        try {
                                            const categoryName = categories.find(c => c.id === newAsset.category_id)?.name;
                                            const res = await fetch('/api/admin/ai-generate', {
                                                method: 'POST',
                                                body: JSON.stringify({
                                                    name: newAsset.name,
                                                    url: newAsset.website_url,
                                                    category: categoryName
                                                })
                                            });
                                            if (res.ok) {
                                                const { data } = await res.json();
                                                setNewAsset(prev => ({
                                                    ...prev,
                                                    description: data.description
                                                    // We could also handle tags here if needed
                                                }));
                                            } else {
                                                alert("AI generation failed. Check API key.");
                                            }
                                        } finally {
                                            setIsSaving(false);
                                        }
                                    }}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-[10px] font-black uppercase text-white hover:bg-purple-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    AI Magic Fill
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                value={newAsset.description || ''}
                                onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                                className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-sm font-medium border border-slate-200 dark:border-slate-800 focus:ring-2 ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                                rows={3}
                                placeholder="Brief description of the tool..."
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
                                className="px-8 py-3 rounded-xl bg-blue-600 text-[10px] font-black uppercase text-white hover:bg-blue-500 shadow-lg"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Asset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {assets
                    .filter(a =>
                        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.categories?.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((asset) => (
                        <div
                            key={asset.id}
                            className={cn(
                                "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-all",
                                editingId === asset.id ? "ring-2 ring-blue-500 border-transparent" : "hover:border-blue-500/20"
                            )}
                        >
                            {editingId === asset.id ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Asset Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name || ''}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 ring-blue-500/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pricing Model</label>
                                            <select
                                                value={(editForm.pricing_model as string) || 'Freemium'}
                                                onChange={(e) => setEditForm({ ...editForm, pricing_model: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 ring-blue-500/20"
                                            >
                                                <option>Free</option>
                                                <option>Freemium</option>
                                                <option>Paid</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Affiliate / Target Link</label>
                                        <input
                                            type="text"
                                            value={editForm.affiliate_link || ''}
                                            onChange={(e) => setEditForm({ ...editForm, affiliate_link: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-bold border-none focus:ring-2 ring-blue-500/20"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl bg-slate-500/5 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id={`is-sponsored-${asset.id}`}
                                                checked={editForm.is_sponsored || false}
                                                onChange={(e) => setEditForm({ ...editForm, is_sponsored: e.target.checked })}
                                                className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                            />
                                            <label htmlFor={`is-sponsored-${asset.id}`} className="text-[10px] font-black text-amber-600 uppercase tracking-widest cursor-pointer">
                                                Sponsored
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id={`is-verified-${asset.id}`}
                                                checked={editForm.is_verified || false}
                                                onChange={(e) => setEditForm({ ...editForm, is_verified: e.target.checked })}
                                                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor={`is-verified-${asset.id}`} className="text-[10px] font-black text-blue-600 uppercase tracking-widest cursor-pointer">
                                                Verified
                                            </label>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valid Until</label>
                                            <input
                                                type="date"
                                                value={editForm.sponsored_until ? new Date(editForm.sponsored_until).toISOString().split('T')[0] : ''}
                                                onChange={(e) => setEditForm({ ...editForm, sponsored_until: e.target.value })}
                                                className="w-full bg-white dark:bg-slate-900 rounded-lg px-3 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                        <textarea
                                            value={editForm.description || ''}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-medium border-none focus:ring-2 ring-blue-500/20"
                                            rows={3}
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
                                            onClick={() => handleSave(asset.id)}
                                            disabled={isSaving}
                                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-[10px] font-black uppercase text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
                                        >
                                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
                                            Update Asset
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 flex items-center justify-center p-3 shadow-sm">
                                        <ToolIcon
                                            url={asset.logo_url}
                                            name={asset.name}
                                            websiteUrl={asset.website_url}
                                            width={48}
                                            height={48}
                                            className="h-full w-full"
                                            imgClassName="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{asset.name}</h3>
                                            <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                                                {asset.categories?.name}
                                            </span>
                                            {asset.is_sponsored && (
                                                <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                                                    <TrendingUp size={10} />
                                                    Sponsored
                                                </span>
                                            )}
                                            {asset.is_verified && (
                                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 flex items-center gap-1">
                                                    <Shield size={10} />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mb-3">
                                            {asset.description}
                                        </p>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <TrendingUp size={12} className="text-blue-500" />
                                                {asset.vote_count} Power
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <ExternalLink size={12} className="text-green-500" />
                                                {(asset as any).click_count || 0} Clicks
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={async () => {
                                                if (enrichingId) return;
                                                setEnrichingId(asset.id);
                                                try {
                                                    const res = await fetch('/api/admin/enrich', {
                                                        method: 'POST',
                                                        body: JSON.stringify({ itemId: asset.id })
                                                    });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setAssets(assets.map(a => a.id === asset.id ? { ...a, description: data.enhancedDescription } : a));
                                                    }
                                                } finally {
                                                    setEnrichingId(null);
                                                }
                                            }}
                                            className={cn(
                                                "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                                                enrichingId === asset.id ? "bg-blue-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600"
                                            )}
                                            title="AI Enrich Meta"
                                        >
                                            {enrichingId === asset.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={18} />}
                                        </button>
                                        <button
                                            onClick={() => startEditing(asset)}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 transition-all"
                                            title="Edit Asset"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(asset.id)}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all"
                                            title="Retire Asset"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
