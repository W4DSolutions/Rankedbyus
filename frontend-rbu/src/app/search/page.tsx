import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ToolCard } from "@/components/ToolCard";

export default async function SearchResultsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q: query } = await searchParams;

    if (!query) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-3xl font-bold text-white mb-4">No search query provided</h1>
                <Link href="/" className="text-blue-400 hover:underline">Return to Home</Link>
            </div>
        );
    }

    const supabase = await createClient();

    const { data: results, error } = await supabase
        .from('items')
        .select(`
            *,
            categories:category_id (name, slug),
            item_tags (
                tags (*)
            )
        `)
        .eq('status', 'approved')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('score', { ascending: false });

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
                        <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-bold text-[10px]">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tight">Search Results</h1>
                    <p className="mt-2 text-slate-400">Showing results for "{query}"</p>
                </div>

                {(!results || results.length === 0) ? (
                    <div className="rounded-2xl border border-slate-700/30 bg-slate-800/20 p-20 text-center backdrop-blur-sm">
                        <div className="text-6xl mb-6 opacity-20 text-white">🔍</div>
                        <h2 className="text-2xl font-bold text-white mb-4">No tools found</h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            We couldn't find any tools matching your search. Try different keywords or browse our categories.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/#categories" className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40">
                                Browse Categories
                            </Link>
                            <Link href="/" className="rounded-xl border border-slate-700 bg-slate-800 px-8 py-3 text-sm font-bold text-white hover:bg-slate-700 transition-all">
                                Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.map((item: any, index: number) => (
                            <ToolCard
                                key={item.id}
                                tool={item}
                                rank={index + 1}
                                showCategory={true}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
