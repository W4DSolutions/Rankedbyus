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
  created_at: string;
}

export interface Vote {
  id: string;
  item_id: string;
  session_id: string;
  value: number;
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
        Insert: Omit<Item, 'id' | 'created_at' | 'vote_count' | 'score' | 'featured' | 'status'> & {
          status?: ItemStatus;
          featured?: boolean;
          vote_count?: number;
          score?: number;
        };
        Update: Partial<Item>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Vote>;
      };
    };
  };
};
