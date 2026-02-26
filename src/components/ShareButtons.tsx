'use client';

import { useState, useEffect } from 'react';
import { Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
    url: string;
    title: string;
    className?: string;
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    const shareUrl = isMounted ? `${window.location.origin}${url}` : url;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const links = [
        {
            name: 'X',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: 'hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'hover:bg-[#0077b5] hover:text-white'
        }
    ];

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: shareUrl
                });
            } catch (err) {
                // Silently handle cancel/error
            }
        }
    };

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="flex -space-x-1">
                {/* Native Share Trigger (Only if supported and mounted) */}
                {isMounted && typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                        onClick={handleNativeShare}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white border border-blue-500 shadow-lg shadow-blue-500/20 z-10 hover:scale-110 transition-all"
                        title="Share on mobile/device"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                    </button>
                )}
                {links.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 transition-all",
                            link.color
                        )}
                        title={`Share on ${link.name}`}
                    >
                        <link.icon size={16} />
                    </a>
                ))}
            </div>

            <button
                onClick={copyToClipboard}
                className={cn(
                    "flex h-10 px-4 items-center gap-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all",
                    copied ? "text-green-600 border-green-500/30 bg-green-50 dark:bg-green-900/10" : "hover:border-blue-500/30 hover:text-blue-600"
                )}
            >
                {copied ? (
                    <>
                        <Check size={14} />
                        Copied
                    </>
                ) : (
                    <>
                        <LinkIcon size={14} />
                        Copy Analysis URL
                    </>
                )}
            </button>
        </div>
    );
}
