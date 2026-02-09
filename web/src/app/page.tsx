import Link from "next/link";
import { SubmitToolModal } from "@/components/SubmitToolModal";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/models";

export default async function Home() {
  const supabase = await createClient();

  // Fetch categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  const categories = (categoriesData || []) as Category[];

  // Fetch total stats
  const { count: totalItems } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { count: totalVotes } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true });

  const categoryIcons: Record<string, string> = {
    'ai-writing-tools': '✍️',
    'ai-image-generators': '🎨',
    'ai-video-tools': '🎬',
    'ai-code-assistants': '💻',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <h1 className="text-xl font-bold text-white">RankedByUs</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#categories" className="text-sm text-slate-300 hover:text-white transition-colors">
                Categories
              </a>
              <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">
                How It Works
              </a>
              <SubmitToolModal />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white sm:text-6xl">
              The Internet's Safest
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Community-Ranked Recommendations
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Discover the best AI tools, apps, and services ranked by real users. No spam, no chaos — just trusted recommendations.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <a
                href="#categories"
                className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Browse Rankings
              </a>
              <SubmitToolModal className="rounded-lg border border-slate-600 bg-slate-800/50 px-6 py-3 text-base font-medium text-white hover:bg-slate-800 transition-colors">
                Submit a Tool
              </SubmitToolModal>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white">{totalItems || 0}</div>
              <div className="mt-1 text-sm text-slate-400">Tools Ranked</div>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white">{totalVotes || 0}</div>
              <div className="mt-1 text-sm text-slate-400">Community Votes</div>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold text-white">{categories.length || 0}</div>
              <div className="mt-1 text-sm text-slate-400">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white">Browse Categories</h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-slate-800"
              >
                <div className="text-4xl">{categoryIcons[category.slug] || '🔧'}</div>
                <h4 className="mt-4 text-xl font-semibold text-white">{category.name}</h4>
                <p className="mt-2 text-sm text-slate-400">{category.description}</p>
                <div className="mt-4 flex items-center text-sm text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
                  View Rankings →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-slate-700/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-3xl font-bold text-white">How It Works</h3>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-3xl">
                🗳️
              </div>
              <h4 className="mt-4 text-lg font-semibold text-white">Vote</h4>
              <p className="mt-2 text-sm text-slate-400">
                Upvote or downvote tools based on your experience
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-3xl">
                📊
              </div>
              <h4 className="mt-4 text-lg font-semibold text-white">Rankings Update</h4>
              <p className="mt-2 text-sm text-slate-400">
                Community votes determine the real-time rankings
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl">
                ✨
              </div>
              <h4 className="mt-4 text-lg font-semibold text-white">Discover</h4>
              <p className="mt-2 text-sm text-slate-400">
                Find the best tools trusted by real users
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
