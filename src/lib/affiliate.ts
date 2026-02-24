/**
 * RankedByUs - Affiliate & Link Optimization Engine
 * This handles the automatic conversion of standard URLs into optimized affiliate links.
 */

interface AffiliateRule {
    domain: string;
    paramName: string;
    id: string;
}

// These can be moved to environment variables later for maximum flexibility
const GLOBAL_RULES: AffiliateRule[] = [
    { domain: 'appsumo.com', paramName: 'rf', id: 'rankedbyus' },
    { domain: 'lemonqueezy.com', paramName: 'aff', id: 'rankedbyus' },
    { domain: 'gumroad.com', paramName: 'a', id: 'rankedbyus' },
    { domain: 'amazon.com', paramName: 'tag', id: 'rankedbyus-20' },
];

/**
 * Optimizes a URL by injecting the correct affiliate parameters if not already present.
 */
export function optimizeLink(url: string | null | undefined): string {
    if (!url) return '';

    try {
        const u = new URL(url.startsWith('http') ? url : `https://${url}`);

        // Find a matching rule for the current domain
        const rule = GLOBAL_RULES.find(r => u.hostname.includes(r.domain));

        if (rule) {
            // Only add if the parameter is missing (don't overwrite custom links)
            if (!u.searchParams.has(rule.paramName)) {
                u.searchParams.set(rule.paramName, rule.id);
            }
        }

        return u.toString();
    } catch (e) {
        // Fallback to original string if URL parsing fails
        return url;
    }
}

/**
 * Strips tracking parameters for a clean "canonical" display URL.
 */
export function getCleanDomain(url: string | null | undefined): string {
    if (!url) return '';
    try {
        const u = new URL(url.startsWith('http') ? url : `https://${url}`);
        return u.hostname.replace('www.', '');
    } catch (e) {
        return url;
    }
}
