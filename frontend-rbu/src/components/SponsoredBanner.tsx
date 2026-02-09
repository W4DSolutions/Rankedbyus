import { createClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';

export async function SponsoredBanner() {
    const supabase = await createClient();

    // Fetch a random featured/sponsored tool
    // In a real app, you might have a 'sponsored_until' column
    const { data: sponsoredTool } = await supabase
        .from('items')
        .select('*')
        .eq('status', 'approved')
        .eq('featured', true)
        .limit(1)
        .single();

    if (!sponsoredTool) {
        // Fallback or hide if no sponsored tool
        return null;
    }

    const tool = sponsoredTool as any;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 border border-blue-500/30 p-1 flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-blue-500/10 mb-8 group">
            <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />

            <div className="relative z-10 flex-shrink-0 ml-4 hidden md:block">
                <div className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-blue-500/30">
                    Sponsored
                </div>
            </div>

            <div className="relative z-10 flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-slate-900 border border-blue-500/50 flex items-center justify-center p-3 shadow-inner">
                <img
                    src={tool.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tool.name)}&background=1e293b&color=fff&size=128&bold=true`}
                    alt={tool.name}
                    className="h-full w-full object-contain rounded-lg"
                />
            </div>

            <div className="relative z-10 flex-1 text-center md:text-left py-4 pr-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h4 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{tool.name}</h4>
                    <span className="md:hidden inline-block bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-blue-500/30 w-fit mx-auto">Sponsored</span>
                </div>
                <p className="text-slate-300 text-sm max-w-xl line-clamp-2">
                    {tool.description}
                </p>
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                        <span>Verified Tool</span>
                        <span className="text-slate-600">•</span>
                        <span>Community Trusted</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 p-4 w-full md:w-auto">
                <a
                    href={tool.affiliate_link || tool.website_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 group-hover:scale-105 active:scale-95"
                >
                    Visit Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
