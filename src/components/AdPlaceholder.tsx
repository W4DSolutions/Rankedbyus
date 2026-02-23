import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface AdPlaceholderProps {
    className?: string;
}

export function AdPlaceholder({ className }: AdPlaceholderProps) {
    return (
        <div className={`group relative overflow-hidden rounded-[2rem] border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-8 transition-all ${className}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent)] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Visual / Icon */}
                <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-inner">
                        <span className="text-xs font-black uppercase tracking-widest text-center">Ad<br />Space</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">
                        Sponsored Content
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                        Reach 10,000+ AI Builders
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-xl">
                        Position your tool directly in the workflow of high-intent technical buyers.
                        Secure this prime placement for Q2 2026.
                    </p>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                    <Link
                        href="/advertise"
                        className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                        Inquire Now
                        <ExternalLink size={14} />
                    </Link>
                </div>
            </div>

            {/* Pattern Overlay */}
            <div className="absolute -right-12 -bottom-12 opacity-[0.03] text-blue-950 dark:text-blue-50 pointer-events-none rotate-12 scale-150">
                <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor">
                    <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="2" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#dot-pattern)" />
                </svg>
            </div>
        </div>
    );
}
