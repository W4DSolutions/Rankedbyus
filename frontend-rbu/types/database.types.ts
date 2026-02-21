export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ItemStatus = 'pending' | 'approved' | 'rejected';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  seo_meta: Record<string, unknown> | null; // JSONB
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
  pricing_model: string | null;
  user_id: string | null;
  is_sponsored?: boolean;
  sponsored_until?: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string | null;
  item_id: string;
  session_id: string;
  rating: number;
  comment: string | null;
  status: ItemStatus;
  helpful_count?: number;
  created_at: string;
}

export interface Vote {
  id: string;
  user_id: string | null;
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

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string | null;
  status: string | null;
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
// export type Database = {
//   public: {
//     Tables: {
//       categories: {
//         Row: Category;
//         Insert: Omit<Category, 'id' | 'created_at'>;
//         Update: Partial<Category>;
//         Relationships: [];
//       };
//       items: {
//         Row: Item;
//         Insert: Omit<Item, 'id' | 'created_at' | 'vote_count' | 'score' | 'featured' | 'status' | 'average_rating' | 'review_count'> & {
//           status?: ItemStatus;
//           featured?: boolean;
//           vote_count?: number;
//           score?: number;
//           average_rating?: number;
//           review_count?: number;
//         };
//         Update: Partial<Item>;
//         Relationships: [];
//       };
//       votes: {
//         Row: Vote;
//         Insert: Omit<Vote, 'id' | 'created_at'>;
//         Update: Partial<Vote>;
//         Relationships: [];
//       };
//       tags: {
//         Row: Tag;
//         Insert: Omit<Tag, 'id' | 'created_at'>;
//         Update: Partial<Tag>;
//         Relationships: [];
//       };
//       item_tags: {
//         Row: ItemTag;
//         Insert: Omit<ItemTag, 'id' | 'created_at'>;
//         Update: Partial<ItemTag>;
//         Relationships: [];
//       };
//       reviews: {
//         Row: Review;
//         Insert: Omit<Review, 'id' | 'created_at' | 'status'> & { status?: ItemStatus };
//         Update: Partial<Review>;
//         Relationships: [];
//       };
//       newsletter_subscribers: {
//         Row: NewsletterSubscriber;
//         Insert: Omit<NewsletterSubscriber, 'id' | 'created_at' | 'status' | 'source'> & {
//           id?: string;
//           created_at?: string;
//           status?: string | null;
//           source?: string | null;
//         };
//         Update: Partial<NewsletterSubscriber>;
//         Relationships: [];
//       };
//     };
//     Views: {
//       [_ in never]: never
//     };
//     Functions: {
//       [_ in never]: never
//     };
//     Enums: {
//       [_ in never]: never
//     };
//     CompositeTypes: {
//       [_ in never]: never
//     };
//   };
// };
