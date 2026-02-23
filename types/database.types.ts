export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ItemStatus = 'pending' | 'approved' | 'rejected';

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          seo_meta: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          seo_meta?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          seo_meta?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
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
          is_verified?: boolean;
          click_count: number;
          payment_amount?: number | null;
          payment_status?: string | null;
          transaction_id?: string | null;
          submitter_email?: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          affiliate_link?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          status?: ItemStatus;
          featured?: boolean;
          vote_count?: number;
          score?: number;
          average_rating?: number;
          review_count?: number;
          pricing_model?: string | null;
          user_id?: string | null;
          is_sponsored?: boolean;
          sponsored_until?: string;
          is_verified?: boolean;
          click_count?: number;
          payment_amount?: number | null;
          payment_status?: string | null;
          transaction_id?: string | null;
          submitter_email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          affiliate_link?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          status?: ItemStatus;
          featured?: boolean;
          vote_count?: number;
          score?: number;
          average_rating?: number;
          review_count?: number;
          pricing_model?: string | null;
          user_id?: string | null;
          is_sponsored?: boolean;
          sponsored_until?: string;
          is_verified?: boolean;
          click_count?: number;
          payment_amount?: number | null;
          payment_status?: string | null;
          transaction_id?: string | null;
          submitter_email?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: string;
          user_id: string | null;
          item_id: string;
          session_id: string;
          value: number;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          item_id: string;
          session_id: string;
          value: number;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          item_id?: string;
          session_id?: string;
          value?: number;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string | null;
          item_id: string;
          session_id: string;
          rating: number;
          comment: string | null;
          status: ItemStatus;
          helpful_count?: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          item_id: string;
          session_id: string;
          rating: number;
          comment?: string | null;
          status?: ItemStatus;
          helpful_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          item_id?: string;
          session_id?: string;
          rating?: number;
          comment?: string | null;
          status?: ItemStatus;
          helpful_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
          status?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      vote_audit_logs: {
        Row: {
          id: string;
          ip_address: string | null;
          user_agent: string | null;
          session_id: string | null;
          item_id: string | null;
          action: string;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          item_id?: string | null;
          action: string;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          item_id?: string | null;
          action?: string;
          message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      item_tags: {
        Row: {
          id: string;
          item_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          color?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          excerpt: string | null;
          item_id: string | null;
          author_name: string | null;
          author_image: string | null;
          featured_image: string | null;
          is_published: boolean;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: string;
          excerpt?: string | null;
          item_id?: string | null;
          author_name?: string | null;
          author_image?: string | null;
          featured_image?: string | null;
          is_published?: boolean;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string;
          excerpt?: string | null;
          item_id?: string | null;
          author_name?: string | null;
          author_image?: string | null;
          featured_image?: string | null;
          is_published?: boolean;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      claim_requests: {
        Row: {
          id: string;
          item_id: string;
          email: string;
          proof_url: string;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          email: string;
          proof_url: string;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          email?: string;
          proof_url?: string;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      clicks: {
        Row: {
          id: string;
          item_id: string;
          session_id: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          session_id?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          session_id?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      article_views: {
        Row: {
          id: string;
          article_id: string;
          session_id: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          session_id?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          session_id?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      claim_session_history: {
        Args: {
          p_session_id: string;
          p_user_id: string;
        };
        Returns: Record<string, unknown>;
      };
      increment_click_count: {
        Args: {
          item_row_id: string;
        };
        Returns: Record<string, unknown>;
      };
      increment_review_helpful: {
        Args: {
          review_row_id: string;
        };
        Returns: Record<string, unknown>;
      };
      increment_article_view: {
        Args: {
          article_row_id: string;
        };
        Returns: Record<string, unknown>;
      };
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};

// Also export the simple interfaces for convenience
export type Category = Database['public']['Tables']['categories']['Row'];
export type Item = Database['public']['Tables']['items']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Vote = Database['public']['Tables']['votes']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type ItemTag = Database['public']['Tables']['item_tags']['Row'];
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row'];
export type VoteAuditLog = Database['public']['Tables']['vote_audit_logs']['Row'];
export type Article = Database['public']['Tables']['articles']['Row'];
