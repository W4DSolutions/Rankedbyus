import Link from "next/link";
import { SubmitToolModal } from "@/components/SubmitToolModal";
import { SearchBar } from "@/components/SearchBar";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Footer } from "@/components/Footer";
import type { Category } from "@/types/models";
import {
  PenTool,
  Palette,
  Video,
  Code2,
  Cloud,
  Globe,
  Rocket,
  ChevronRight,
  TrendingUp,
  Users,
  User,
  Layers,
  FolderOpen,
  ArrowRight,
  Zap,
  MessageSquare,
  Star,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { ItemWithDetails } from "@/types/models";
import Image from "next/image";
import { getLogoUrl } from '@/lib/utils';
import { ToolIcon } from '@/components/ToolIcon';

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

  // Fetch categories with top approved items
  const { data: categoriesData } = await supabase
    .from('categories')
    .select(`
      *,
      items:items(name, slug, logo_url, website_url, score, status)
    `)
    .eq('items.status', 'approved')
    .order('created_at', { ascending: true });

  const categories = (categoriesData || []).map(cat => {
    const approvedItems = (cat.items as any[] || []).filter(item => item.status === 'approved');
    const sortedItems = [...approvedItems].sort((a, b) => (b.score || 0) - (a.score || 0));
    return {
      ...cat,
      itemCount: approvedItems.length,
      topItems: sortedItems.slice(0, 3)
    };
  });

  // Fetch total stats
  const { count: totalItems } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { count: totalVotes } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true });

  // Fetch top tools
  const { data: trendingData } = await supabase
    .from('items')
    .select('*, categories:category_id(name, slug), articles(*)')
    .eq('status', 'approved')
    .order('score', { ascending: false })
    .limit(4);

  const trendingTools = (trendingData || []) as ItemWithDetails[];

  // Fetch recent reviews
  const { data: recentReviewsData } = await supabase
    .from('reviews')
    .select('*, items:item_id(name, slug, logo_url, website_url)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(6);

  const recentReviews = (recentReviewsData || []) as any[];

  // Fetch articles
  const { data: articlesData } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const categoryIcons: Record<string, LucideIcon> = {
    'ai-writing-tools': PenTool,
    'ai-image-generators': Palette,
    'ai-video-tools': Video,
    'ai-code-assistants': Code2,
    'cloud-hosting': Cloud,
    'esim-providers': Globe,
    'saas-essentials': Rocket,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500" suppressHydrationWarning>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-blue-600 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-xl font-black text-white uppercase">R</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">RankedByUs</h1>
            </Link>
            <nav className="flex items-center gap-8">
              <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Intelligence
              </Link>
              <Link href="/about" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                About
              </Link>
              <Link href="/profile" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <User size={20} />
              </Link>
              <ThemeToggle />
              <SubmitToolModal />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-44 pb-32 text-center">
        <div className="absolute inset-0 bg-mesh dark:bg-mesh-dark opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.08),transparent_50%)] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <TrendingUp size={14} />
            Verified for 2026 Operations
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            The Master <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent italic">
              Registry
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Discover the high-utility AI tools, apps, and interfaces ranked by the community. No noise — just technical authority and user validation.
          </p>

          <div className="mt-16 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <SearchBar />
          </div>

          <div className="mt-12 flex justify-center gap-6 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-400">
            <a
              href="#categories"
              className="rounded-2xl bg-slate-900 dark:bg-blue-600 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              Explore Rankings
            </a>
            <SubmitToolModal className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
              Submit Asset
            </SubmitToolModal>
          </div>
        </div>

        {/* Stats */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-10 text-center backdrop-blur-xl shadow-sm transition-all hover:shadow-2xl hover:border-blue-500/20 hover:-translate-y-1">
              <div className="flex justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500">
                <Layers size={36} />
              </div>
              <div className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2">{totalItems || 0}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ranked Assets</div>
            </div>
            <div className="group rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-10 text-center backdrop-blur-xl shadow-sm transition-all hover:shadow-2xl hover:border-purple-500/20 hover:-translate-y-1">
              <div className="flex justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp size={36} />
              </div>
              <div className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2">{(totalVotes || 0).toLocaleString()}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Community Signals</div>
            </div>
            <div className="group rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-10 text-center backdrop-blur-xl shadow-sm transition-all hover:shadow-2xl hover:border-green-500/20 hover:-translate-y-1">
              <div className="flex justify-center mb-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-500">
                <Users size={36} />
              </div>
              <div className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2">{categories.length || 0}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Sektors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="py-32 bg-slate-50 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-10">
            <div>
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                <FolderOpen size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Asset Index</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Operational Sektors</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Classified rankings across the technology landscape</p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] || FolderOpen;
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-10 hover:border-blue-500/30 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm hover:shadow-2xl hover:-translate-y-1 duration-500"
                >
                  <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 text-slate-900 dark:text-white pointer-events-none">
                    <Icon size={160} strokeWidth={1} />
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <Icon size={28} strokeWidth={2} />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:border-blue-500/30 transition-all">
                      {category.itemCount} Assets
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                    {category.description || `Tactical analysis of the top ${category.name.toLowerCase()} available for deployment.`}
                  </p>

                  <div className="space-y-3 mb-10 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Top Performance Assets</div>
                    {category.topItems.map((item: any) => (
                      <div key={item.slug} className="flex items-center gap-3 group/item">
                        <div className="h-6 w-6 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <ToolIcon
                            url={item.logo_url}
                            name={item.name}
                            websiteUrl={item.website_url}
                            width={16}
                            height={16}
                            className="h-full w-full"
                            imgClassName="object-contain p-1"
                            unoptimized={true}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 truncate group-hover/item:text-blue-600 transition-colors uppercase tracking-tight">
                          {item.name}
                        </span>
                        <div className="ml-auto text-[8px] font-black text-slate-300 dark:text-slate-700">
                          {item.score}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    Access Intel
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Intelligence Signals */}
      <section className="py-32 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 dark:border-slate-800 pb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
                <MessageSquare size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Intelligence</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Live Signal Feed</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Real-time tactical feedback from verified auditors</p>
            </div>
            <Link href="/#categories" className="inline-flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all">
              View Master Stats <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {recentReviews.length > 0 ? (
              recentReviews.map((review: any) => (
                <div key={review.id} className="group relative rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-10 hover:border-purple-500/30 transition-all shadow-sm hover:shadow-2xl duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden p-2">
                      {review.items?.logo_url || review.items?.website_url ? (
                        <ToolIcon
                          url={review.items.logo_url}
                          name={review.items.name}
                          websiteUrl={review.items.website_url}
                          width={40}
                          height={40}
                          className="h-full w-full"
                          imgClassName="object-contain"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-black text-slate-400 text-xs">AI</div>
                      )}
                    </div>
                    <div>
                      <Link href={`/tool/${review.items?.slug}`} className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight hover:text-purple-600 transition-colors">
                        {review.items?.name}
                      </Link>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 dark:text-slate-800"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 italic font-medium leading-relaxed relative">
                    <span className="absolute -left-3 top-0 text-slate-100 dark:text-slate-800 text-4xl leading-none select-none font-serif">&quot;</span>
                    {review.comment || "Tactical deployment completed with optimal efficiency. Asset verified for production use."}
                  </p>
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auditor: {review.session_id.substring(0, 4)}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 p-10 bg-slate-50/50 dark:bg-slate-900/10">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 animate-pulse" />
                  <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl mb-8 animate-pulse" />
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Strategic Analysis (Blog) Section */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deep Intel</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Strategic Analysis</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">In-depth research papers on industry-leading assets</p>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all shadow-sm">
              Intelligence Hub <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articlesData?.map((article: any) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group flex flex-col h-full rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-10 hover:border-blue-500/30 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-slate-50 dark:bg-slate-800" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Tactical Brief</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="text-[9px] font-black uppercase tracking-widest">Study Report</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-44 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/[0.02] dark:bg-blue-600/[0.03] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="rounded-[4rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-20 md:p-32 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50" />

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10">
              <Rocket size={14} />
              Community Expansion
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tighter leading-[0.9]">
              Shape the <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent italic">Power Grid</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
              Is your favorite tool missing from the master registry? Influence the rankings by suggested new assets for community audit.
            </p>
            <SubmitToolModal className="rounded-[1.5rem] bg-slate-900 dark:bg-blue-600 px-12 py-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20 active:scale-95" />
          </div>
        </div>
      </section>

      <NewsletterSection />

      <Footer />
    </div>
  );
}
