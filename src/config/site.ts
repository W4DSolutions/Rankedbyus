export const siteConfig = {
    name: "RankedByUs",
    description: "The internet's safest community-ranked recommendations for AI tools and services.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://rankedbyus.com",
    ogImage: "https://rankedbyus.com/og.jpg",
    links: {
        twitter: "https://twitter.com/rankedbyus",
        github: "https://github.com/W4DSolutions/frontend-rbu",
    },
    contactEmail: "hello@rankedbyus.com",
    legalEmail: "legal@rankedbyus.com",
    niches: ["AI Tools", "Hosting", "eSIM", "SaaS"],
};

export type SiteConfig = typeof siteConfig;
