import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://rankedbyus.com').replace(/\/$/, '');

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/go/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
