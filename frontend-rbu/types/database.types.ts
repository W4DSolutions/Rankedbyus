export type ItemStatus = 'pending' | 'approved' | 'rejected';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  seo_meta: any; // JSONB
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
  value: number;
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
}

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Category>;
      };
      items: {
        Row: Item;
        Insert: Omit<Item, 'id' | 'created_at' | 'vote_count' | 'score' | 'featured' | 'status' | 'average_rating' | 'review_count'> & {
          status?: ItemStatus;
          featured?: boolean;
          vote_count?: number;
          score?: number;
          average_rating?: number;
          review_count?: number;
        };
        Update: Partial<Item>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Vote>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, 'id' | 'created_at'>;
        Update: Partial<Tag>;
      };
      item_tags: {
        Row: ItemTag;
        Insert: Omit<ItemTag, 'id' | 'created_at'>;
        Update: Partial<ItemTag>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at' | 'status'> & { status?: ItemStatus };
        Update: Partial<Review>;
      };
    };
  };
};
