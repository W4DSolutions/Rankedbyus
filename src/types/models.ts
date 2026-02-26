// Shared types for the application
export type ItemStatus = 'pending' | 'approved' | 'rejected';

export interface Category {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    seo_meta: Record<string, unknown> | null;
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
    click_count: number;
    pricing_model: string | null;
    is_sponsored?: boolean;
    sponsored_until?: string;
    is_verified?: boolean;
    payment_status?: 'unpaid' | 'paid' | 'refunded' | 'failed';
    transaction_id?: string;
    payment_amount?: number;
    rejection_reason?: string | null;
    last_status_change_at?: string;
    created_at: string;
}

export interface Review {
    id: string;
    item_id: string;
    session_id: string;
    rating: number;
    comment: string | null;
    status: ItemStatus;
    helpful_count?: number;
    owner_reply?: string | null;
    owner_reply_at?: string | null;
    created_at: string;
}

export interface ReviewWithItem extends Review {
    items: Item;
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

export interface Article {
    id: string;
    item_id: string | null;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    author_name: string | null;
    author_image: string | null;
    featured_image: string | null;
    is_published: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;
    published_at: string | null;
}

export interface ItemWithDetails extends Item {
    categories?: Category;
    item_tags?: (ItemTag & { tags: Tag })[];
    articles?: Article[];
}


