// Auto-generated Supabase database types.
// Run: npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/lib/supabase/types.ts
// For now this is a minimal hand-written version that matches our schema.
//
// NOTE: The DB columns `stripe_customer_id` and `stripe_subscription_id` now
// store Paddle IDs. A migration to rename them is recommended:
//   ALTER TABLE users  RENAME COLUMN stripe_customer_id  TO paddle_customer_id;
//   ALTER TABLE teams  RENAME COLUMN stripe_subscription_id TO paddle_subscription_id;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          plan: "free" | "pro" | "business" | "enterprise";
          ai_credits_used: number;
          ai_credits_limit: number;
          ls_customer_id: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "pro" | "business" | "enterprise";
          ai_credits_used?: number;
          ai_credits_limit?: number;
          ls_customer_id?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "pro" | "business" | "enterprise";
          ai_credits_used?: number;
          ai_credits_limit?: number;
          ls_customer_id?: string | null;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
      };
      sites: {
        Row: {
          id: string;
          owner_id: string;
          team_id: string | null;
          name: string;
          slug: string;
          status: "draft" | "published" | "archived";
          domain: string | null;
          custom_domain: string | null;
          vercel_project_id: string | null;
          design_tokens: Json;
          auth_config: Json | null;
          schema_config: Json | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          team_id?: string | null;
          name: string;
          slug: string;
          status?: "draft" | "published" | "archived";
          domain?: string | null;
          custom_domain?: string | null;
          vercel_project_id?: string | null;
          design_tokens?: Json;
          auth_config?: Json | null;
          schema_config?: Json | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          status?: "draft" | "published" | "archived";
          domain?: string | null;
          custom_domain?: string | null;
          vercel_project_id?: string | null;
          design_tokens?: Json;
          auth_config?: Json | null;
          schema_config?: Json | null;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      pages: {
        Row: {
          id: string;
          site_id: string;
          title: string;
          slug: string;
          is_homepage: boolean;
          sort_order: number;
          content: Json;
          meta: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_id: string;
          title: string;
          slug: string;
          is_homepage?: boolean;
          sort_order?: number;
          content?: Json;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          is_homepage?: boolean;
          sort_order?: number;
          content?: Json;
          meta?: Json;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          plan: string;
          stripe_subscription_id: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          plan?: string;
          stripe_subscription_id?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          plan?: string;
          stripe_subscription_id?: string | null;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: "owner" | "admin" | "designer" | "editor" | "viewer";
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: "owner" | "admin" | "designer" | "editor" | "viewer";
          created_at?: string;
        };
        Update: {
          role?: "owner" | "admin" | "designer" | "editor" | "viewer";
        };
      };
      team_invites: {
        Row: {
          id: string;
          email: string;
          role: "admin" | "designer" | "editor" | "viewer";
          invited_by: string | null;
          owner_id: string;
          status: "pending" | "accepted" | "expired";
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role: "admin" | "designer" | "editor" | "viewer";
          invited_by?: string | null;
          owner_id: string;
          status?: "pending" | "accepted" | "expired";
          created_at?: string;
          expires_at?: string;
        };
        Update: {
          status?: "pending" | "accepted" | "expired";
        };
      };
      deployments: {
        Row: {
          id: string;
          site_id: string;
          status: "building" | "ready" | "failed" | "cancelled";
          url: string | null;
          vercel_deployment_id: string | null;
          created_at: string;
          finished_at: string | null;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          site_id: string;
          status?: "building" | "ready" | "failed" | "cancelled";
          url?: string | null;
          vercel_deployment_id?: string | null;
          created_at?: string;
          finished_at?: string | null;
          error_message?: string | null;
        };
        Update: {
          status?: "building" | "ready" | "failed" | "cancelled";
          url?: string | null;
          finished_at?: string | null;
          error_message?: string | null;
        };
      };
      page_views: {
        Row: {
          id: string;
          site_id: string | null;
          owner_id: string | null;
          page_path: string;
          referrer: string | null;
          country_code: string | null;
          device_type: "desktop" | "mobile" | "tablet" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          site_id?: string | null;
          owner_id?: string | null;
          page_path?: string;
          referrer?: string | null;
          country_code?: string | null;
          device_type?: "desktop" | "mobile" | "tablet" | null;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          owner_id: string;
          action_type: "publish" | "edit" | "team" | "billing" | "deploy_failed" | "create";
          description: string;
          site_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          owner_id: string;
          action_type: "publish" | "edit" | "team" | "billing" | "deploy_failed" | "create";
          description: string;
          site_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      cms_collections: {
        Row: {
          id: string;
          site_id: string | null;
          owner_id: string;
          name: string;
          slug: string;
          description: string;
          fields: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_id?: string | null;
          owner_id: string;
          name: string;
          slug: string;
          description?: string;
          fields?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          fields?: Json;
          updated_at?: string;
        };
      };
      cms_items: {
        Row: {
          id: string;
          collection_id: string;
          data: Json;
          status: "published" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          collection_id: string;
          data?: Json;
          status?: "published" | "draft";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          data?: Json;
          status?: "published" | "draft";
          updated_at?: string;
        };
      };
      forms: {
        Row: {
          id: string;
          site_id: string | null;
          owner_id: string;
          name: string;
          status: "active" | "paused";
          fields: Json;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_id?: string | null;
          owner_id: string;
          name: string;
          status?: "active" | "paused";
          fields?: Json;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          status?: "active" | "paused";
          fields?: Json;
          settings?: Json;
          updated_at?: string;
        };
      };
      form_submissions: {
        Row: {
          id: string;
          form_id: string;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          data: Json;
          created_at?: string;
        };
        Update: Record<string, never>;
      };
      asset_folders: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          color?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          type: "image" | "video" | "document" | "other";
          url: string | null;
          size_bytes: number;
          width: number | null;
          height: number | null;
          folder_id: string | null;
          starred: boolean;
          tags: string[];
          used_in: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          type: "image" | "video" | "document" | "other";
          url?: string | null;
          size_bytes?: number;
          width?: number | null;
          height?: number | null;
          folder_id?: string | null;
          starred?: boolean;
          tags?: string[];
          used_in?: string[];
          created_at?: string;
        };
        Update: {
          name?: string;
          type?: "image" | "video" | "document" | "other";
          url?: string | null;
          size_bytes?: number;
          width?: number | null;
          height?: number | null;
          folder_id?: string | null;
          starred?: boolean;
          tags?: string[];
          used_in?: string[];
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      plan: "free" | "pro" | "business" | "enterprise";
      site_status: "draft" | "published" | "archived";
      team_role: "owner" | "admin" | "designer" | "editor" | "viewer";
      deployment_status: "building" | "ready" | "failed" | "cancelled";
    };
  };
};

export type UserRow         = Database["public"]["Tables"]["users"]["Row"];
export type SiteRow         = Database["public"]["Tables"]["sites"]["Row"];
export type PageRow         = Database["public"]["Tables"]["pages"]["Row"];
export type TeamRow         = Database["public"]["Tables"]["teams"]["Row"];
export type TeamMemberRow   = Database["public"]["Tables"]["team_members"]["Row"];
export type TeamInviteRow   = Database["public"]["Tables"]["team_invites"]["Row"];
export type DeploymentRow   = Database["public"]["Tables"]["deployments"]["Row"];
export type ActivityLogRow  = Database["public"]["Tables"]["activity_logs"]["Row"];
export type CmsCollectionRow = Database["public"]["Tables"]["cms_collections"]["Row"];
export type CmsItemRow      = Database["public"]["Tables"]["cms_items"]["Row"];
export type FormRow         = Database["public"]["Tables"]["forms"]["Row"];
export type FormSubmissionRow = Database["public"]["Tables"]["form_submissions"]["Row"];
export type AssetRow        = Database["public"]["Tables"]["assets"]["Row"];
export type AssetFolderRow  = Database["public"]["Tables"]["asset_folders"]["Row"];
export type PageViewRow     = Database["public"]["Tables"]["page_views"]["Row"];
