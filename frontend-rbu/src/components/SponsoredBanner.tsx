import { createClient } from '@/lib/supabase/server';
import { Item } from '@/types/models';
import { Zap, MoveRight, ShieldCheck } from 'lucide-react';
import { ToolIcon } from './ToolIcon';

export async function SponsoredBanner() {
    const supabase = await createClient();

    // Fetch a random active sponsored tool
    const { data: sponsoredTool } = await supabase
        .from('items')
        .select('*')
        .eq('status', 'approved')
        .eq('is_sponsored', true)
        // Ensure sponsorship is active (assuming sponsored_until is future or null/empty means indefinite if structured that way, usually not null)
        // .gt('sponsored_until', new Date().toISOString()) // Add this if strict expiry is enforced
        .limit(1)
        .maybeSingle();

    if (!sponsoredTool) {
        return null;
    }

    // Check expiry manually if not handled by query (e.g. if column is nullable)
    if (sponsoredTool.sponsored_until && new Date(sponsoredTool.sponsored_until) < new Date()) {
        return null;
    }

    const tool = sponsoredTool as unknown as Item;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 border border-blue-500/30 p-1 flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-blue-500/10 mb-8 group">
            <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />

            <div className="relative z-10 flex-shrink-0 ml-4 hidden md:block">
                <div className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-blue-500/30 flex items-center gap-1">
                    <Zap size={10} className="fill-current animate-pulse" />
                    Sponsored
                </div>
            </div>

            <div className="relative z-10 flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white dark:bg-slate-900 border border-blue-500/50 flex items-center justify-center p-3 shadow-inner overflow-hidden">
                <ToolIcon
                    url={tool.logo_url}
                    name={tool.name}
                    websiteUrl={tool.website_url}
                    width={80}
                    height={80}
                    imgClassName="object-contain"
                    unoptimized={true}
                />
            </div>

            <div className="relative z-10 flex-1 text-center md:text-left py-4 pr-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{tool.name}</h4>
                    <span className="md:hidden inline-flex items-center gap-1 bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-blue-500/30 w-fit mx-auto">
                        <Zap size={10} className="fill-current" />
                        Sponsored
                    </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl line-clamp-2 font-medium">
                    {tool.description}
                </p>
                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        <ShieldCheck size={12} />
                        <span>Verified Tool</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>Community Trusted</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 p-4 w-full md:w-auto">
                <a
                    href={tool.affiliate_link || tool.website_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-blue-600 px-8 py-3.5 text-sm font-black text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl dark:shadow-blue-900/40 group-hover:scale-105 active:scale-95"
                >
                    Visit Now
                    <MoveRight size={18} />
                </a>
            </div>
        </div>
    );
}
