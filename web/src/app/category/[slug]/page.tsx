import Link from "next/link";
import { notFound } from "next/navigation";
import { VoteButtons } from "@/components/VoteButtons";
import { SubmitToolModal } from "@/components/SubmitToolModal";
import { createClient } from "@/lib/supabase/server";
import type { Item, Category } from "@/types/models";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;

    // Fetch category
    const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (categoryError || !categoryData) {
        notFound();
    }

    const category = categoryData as Category;

    // Fetch approved items for this category, ordered by score
    const { data: items } = await supabase
        .from('items')
        .select('*')
        .eq('category_id', category.id)
        .eq('status', 'approved')
        .order('score', { ascending: false });

    const tools = (items || []) as Item[];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <span className="text-xl font-bold text-white">R</span>
                            </div>
                            <h1 className="text-xl font-bold text-white">RankedByUs</h1>
                        </Link>
                        <nav className="flex items-center gap-6">
                            <Link href="/#categories" className="text-sm text-slate-300 hover:text-white transition-colors">
                                Categories
                            </Link>
                            <SubmitToolModal />
                        </nav>
                    </div>
                </div>
            </header>

            {/* Category Hero */}
            <section className="border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">
                            {category.name.includes('Writing') ? '✍️' :
                                category.name.includes('Image') ? '🎨' :
                                    category.name.includes('Video') ? '🎬' :
                                        category.name.includes('Code') ? '💻' : '🔧'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                            <p className="mt-2 text-slate-300">{category.description}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-6 text-sm text-slate-400">
                        <span>{tools.length} tools ranked</span>
                        <span>•</span>
                        <span>Updated daily</span>
                    </div>
                </div>
            </section>

            {/* Rankings List */}
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {tools.length === 0 ? (
                        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-12 text-center">
                            <div className="text-5xl mb-4">📭</div>
                            <h3 className="text-xl font-semibold text-white">No tools yet</h3>
                            <p className="mt-2 text-slate-400">Be the first to submit a tool in this category!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tools.map((tool, index) => (
                                <div
                                    key={tool.id}
                                    className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-slate-800"
                                >
                                    <div className="flex items-start gap-6">
                                        {/* Rank */}
                                        <div className="flex flex-col items-center">
                                            <div className={`text-2xl font-bold ${index === 0 ? 'text-yellow-400' :
                                                index === 1 ? 'text-slate-300' :
                                                    index === 2 ? 'text-amber-600' :
                                                        'text-slate-500'
                                                }`}>
                                                #{index + 1}
                                            </div>
                                            <div className="mt-2">
                                                <VoteButtons
                                                    itemId={tool.id}
                                                    initialScore={tool.score}
                                                    initialVoteCount={tool.vote_count}
                                                />
                                            </div>
                                        </div>

                                        {/* Logo */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={tool.logo_url || 'https://placehold.co/80x80/334155/white?text=?'}
                                                alt={tool.name}
                                                className="h-20 w-20 rounded-lg"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                                            <p className="mt-1 text-sm text-slate-400">{tool.description}</p>
                                            <div className="mt-3 text-xs text-slate-500">
                                                {tool.vote_count} votes
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex flex-col gap-2">
                                            <a
                                                href={tool.affiliate_link || tool.website_url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                            >
                                                Visit Website
                                            </a>
                                            {tool.website_url && tool.website_url !== tool.affiliate_link && (
                                                <a
                                                    href={tool.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-center text-xs text-slate-400 hover:text-slate-300 transition-colors"
                                                >
                                                    Learn More →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
