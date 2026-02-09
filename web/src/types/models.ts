// Shared types for the application
export type ItemStatus = 'pending' | 'approved' | 'rejected';

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
    status: ItemStatus;
    featured: boolean;
    vote_count: number;
    score: number;
    average_rating: number;
    review_count: number;
    created_at: string;
}

export interface Review {
    id: string;
    item_id: string;
    session_id: string;
    rating: number;
    comment: string | null;
    status: ItemStatus;
    created_at: string;
}

export interface Vote {
    id: string;
    item_id: string;
    session_id: string;
    value: 1 | -1;
    created_at: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    color: string | null;
    created_at: string;
}

export interface ItemTag {
    id: string;
    item_id: string;
    tag_id: string;
    created_at: string;
    tags?: Tag;
}

export interface ItemWithDetails extends Item {
    categories?: Category;
    item_tags?: (ItemTag & { tags: Tag })[];
}
