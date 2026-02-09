// Shared types for the application

export interface Category {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    seo_meta: any;
    created_at: string;
}

export interface Item {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    description: string | null;
    affiliate_link: string | null;
    logo_url: string | null;
    website_url: string | null;
    status: 'pending' | 'approved' | 'rejected';
    featured: boolean;
    vote_count: number;
    score: number;
    created_at: string;
}

export interface Vote {
    id: string;
    item_id: string;
    session_id: string;
    value: 1 | -1;
    created_at: string;
}

export interface ItemWithCategory extends Item {
    categories: Category;
}
