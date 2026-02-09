import Link from "next/link";
import { SubmitToolModal } from "@/components/SubmitToolModal";
import { SearchBar } from "@/components/SearchBar";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NewsletterSection } from "@/components/NewsletterSection";
import type { Category } from "@/types/models";

export const metadata: Metadata = {
  title: "RankedByUs - Community-Ranked AI Tools & Recommendations",
  description: "Discover the best AI tools, writing assistants, image generators, and more. Ranked by real users, verified for 2026. Join the community and vote for your favorites.",
  openGraph: {
    title: "RankedByUs | Trusted Tool Rankings",
    description: "The internet's safest community-ranked recommendations for AI tools and services.",
    type: "website",
  },
};

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
    'cloud-hosting': '☁️',
    'esim-providers': '📶',
    'saas-essentials': '🚀',
  };


  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-xl font-bold text-white">R</span>
              </div>
              <h1 className="text-xl font-bold text-white">RankedByUs</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#categories" className="text-sm text-slate-300 hover:text-white transition-colors hidden md:block">
                Categories
              </a>
              <ThemeToggle />
              <SubmitToolModal />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <div className="mt-10">
            <SearchBar />
          </div>

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
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid gap-8 sm:grid-cols-3">
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

      {/* Categories Grid */}
      <section id="categories" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Explore Categories</h2>
              <p className="mt-2 text-slate-400">Find the right tool for your specific needs</p>
            </div>
            <Link href="#categories" className="text-sm font-medium text-blue-400 hover:text-blue-300">
              View all
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 hover:border-blue-500/50 hover:bg-slate-800 transition-all"
              >
                <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:scale-110 transition-transform grayscale">
                  {categoryIcons[category.slug] || '📁'}
                </div>
                <div className="text-4xl mb-4">{categoryIcons[category.slug] || '📁'}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {category.description || `Browse the top-rated ${category.name.toLowerCase()}`}
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-blue-400">
                  Explore Ranking
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-24 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Want to suggest a tool?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Help the community by submitting great tools that deserve to be ranked.
          </p>
          <SubmitToolModal className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl shadow-blue-500/20">
            Submit Your Tool Now
          </SubmitToolModal>
        </div>
      </section>

      <NewsletterSection />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
              <span className="text-lg font-bold text-white">R</span>
            </div>
            <span className="text-lg font-bold text-white">RankedByUs</span>
          </div>
          <p className="mb-4">© 2026 RankedByUs. Built by the community, for the community.</p>
          <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest font-bold">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
