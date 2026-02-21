import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | Date) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });
}

export function getLogoUrl(logoUrl: string | null | undefined, name: string, websiteUrl?: string | null) {
    // 1. Convert Clearbit to Google S2 (More reliable)
    if (logoUrl?.includes('logo.clearbit.com')) {
        try {
            const domain = logoUrl.split('logo.clearbit.com/')[1];
            if (domain) return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch (e) { }
    }

    // 2. Convert problematic gstatic/faviconV2 to simpler S2 format
    // This handles t0.gstatic.com, t1.gstatic.com, etc. and various URL formats
    const isGstaticV2 = logoUrl && /gstatic\.com.*faviconV2/i.test(logoUrl);
    if (isGstaticV2) {
        try {
            // First try proper URL parsing
            const urlParams = new URLSearchParams(logoUrl.includes('?') ? logoUrl.split('?')[1] : '');
            let targetUrl = urlParams.get('url');

            // If URL parameters fail, try manual substring extraction for the 'url=' part
            if (!targetUrl && logoUrl.includes('url=')) {
                targetUrl = logoUrl.split('url=')[1].split('&')[0];
            }

            if (targetUrl) {
                // Ensure we have a valid domain string
                let domain = targetUrl;
                if (targetUrl.includes('://')) {
                    domain = new URL(targetUrl).hostname;
                }
                domain = domain.replace('www.', '');
                return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            }
        } catch (e) {
            // If parsing fails for any reason, try a blunt regex fallback for 'url=...'
            const match = logoUrl.match(/[?&]url=([^&]+)/);
            if (match && match[1]) {
                const domain = match[1].replace(/^https?:\/\//, '').split('/')[0].replace('www.', '');
                return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            }
        }
    }

    // 3. If no URL but we have a website, generate S2 URL
    if (!logoUrl && websiteUrl) {
        try {
            const domain = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`).hostname.replace('www.', '');
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch (e) { }
    }

    // 4. Ultimate Fallback: UI Avatars
    const isBadSource = logoUrl?.includes('logo.clearbit.com') || logoUrl?.includes('gstatic.com');
    if (!logoUrl || logoUrl === '' || logoUrl === 'null' || logoUrl === 'undefined' || isBadSource) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=fff&size=128&bold=true`;
    }

    return logoUrl;
}
