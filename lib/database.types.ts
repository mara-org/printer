export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      analyses: {
        Row: {
          cost_usd: number | null; created_at: string; document_id: string; id: string;
          input_tokens: number | null; key_terms: Json; model: string | null;
          output_locale: string; output_tokens: number | null; questions: Json; risks: Json;
          summary: string | null; user_id: string;
        }
        Insert: {
          cost_usd?: number | null; created_at?: string; document_id: string; id?: string;
          input_tokens?: number | null; key_terms?: Json; model?: string | null;
          output_locale: string; output_tokens?: number | null; questions?: Json; risks?: Json;
          summary?: string | null; user_id: string;
        }
        Update: {
          cost_usd?: number | null; created_at?: string; document_id?: string; id?: string;
          input_tokens?: number | null; key_terms?: Json; model?: string | null;
          output_locale?: string; output_tokens?: number | null; questions?: Json; risks?: Json;
          summary?: string | null; user_id?: string;
        }
        Relationships: []
      }
      analyze_calls: {
        Row: {
          cost_usd: number; created_at: string; document_id: string | null;
          duration_ms: number | null; error: string | null; id: string;
          input_tokens: number; model: string; ok: boolean; output_tokens: number;
          provider: string; tier: Database["public"]["Enums"]["user_tier"]; user_id: string | null;
        }
        Insert: {
          cost_usd?: number; created_at?: string; document_id?: string | null;
          duration_ms?: number | null; error?: string | null; id?: string;
          input_tokens?: number; model: string; ok: boolean; output_tokens?: number;
          provider: string; tier: Database["public"]["Enums"]["user_tier"]; user_id?: string | null;
        }
        Update: {
          cost_usd?: number; created_at?: string; document_id?: string | null;
          duration_ms?: number | null; error?: string | null; id?: string;
          input_tokens?: number; model?: string; ok?: boolean; output_tokens?: number;
          provider?: string; tier?: Database["public"]["Enums"]["user_tier"]; user_id?: string | null;
        }
        Relationships: []
      }
      app_config: {
        Row: { key: string; updated_at: string; value: Json }
        Insert: { key: string; updated_at?: string; value: Json }
        Update: { key?: string; updated_at?: string; value?: Json }
        Relationships: []
      }
      documents: {
        Row: {
          byte_size: number | null; created_at: string;
          detected_type: Database["public"]["Enums"]["doc_type"] | null; id: string;
          mime_type: string | null; original_filename: string | null; purge_at: string;
          source_locale: string | null; status: string; storage_path: string; user_id: string;
        }
        Insert: {
          byte_size?: number | null; created_at?: string;
          detected_type?: Database["public"]["Enums"]["doc_type"] | null; id?: string;
          mime_type?: string | null; original_filename?: string | null; purge_at?: string;
          source_locale?: string | null; status?: string; storage_path: string; user_id: string;
        }
        Update: {
          byte_size?: number | null; created_at?: string;
          detected_type?: Database["public"]["Enums"]["doc_type"] | null; id?: string;
          mime_type?: string | null; original_filename?: string | null; purge_at?: string;
          source_locale?: string | null; status?: string; storage_path?: string; user_id?: string;
        }
        Relationships: []
      }
      lifecycle_sends: {
        Row: { sent_at: string; stage: string; user_id: string }
        Insert: { sent_at?: string; stage: string; user_id: string }
        Update: { sent_at?: string; stage?: string; user_id?: string }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string; email: string | null; free_docs_reset_at: string;
          free_docs_used: number; id: string; preferred_locale: string;
        }
        Insert: {
          created_at?: string; email?: string | null; free_docs_reset_at?: string;
          free_docs_used?: number; id: string; preferred_locale?: string;
        }
        Update: {
          created_at?: string; email?: string | null; free_docs_reset_at?: string;
          free_docs_used?: number; id?: string; preferred_locale?: string;
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean; current_period_end: string | null;
          price_id: string | null; provider: string;
          provider_customer_id: string | null; provider_subscription_id: string | null;
          status: Database["public"]["Enums"]["sub_status"] | null;
          stripe_customer_id: string | null; stripe_subscription_id: string | null;
          tier: Database["public"]["Enums"]["user_tier"] | null;
          updated_at: string; user_id: string;
        }
        Insert: {
          cancel_at_period_end?: boolean; current_period_end?: string | null;
          price_id?: string | null; provider?: string;
          provider_customer_id?: string | null; provider_subscription_id?: string | null;
          status?: Database["public"]["Enums"]["sub_status"] | null;
          stripe_customer_id?: string | null; stripe_subscription_id?: string | null;
          tier?: Database["public"]["Enums"]["user_tier"] | null;
          updated_at?: string; user_id: string;
        }
        Update: {
          cancel_at_period_end?: boolean; current_period_end?: string | null;
          price_id?: string | null; provider?: string;
          provider_customer_id?: string | null; provider_subscription_id?: string | null;
          status?: Database["public"]["Enums"]["sub_status"] | null;
          stripe_customer_id?: string | null; stripe_subscription_id?: string | null;
          tier?: Database["public"]["Enums"]["user_tier"] | null;
          updated_at?: string; user_id?: string;
        }
        Relationships: []
      }
      waitlist: {
        Row: { created_at: string; email: string; id: string; locale: string; source: string | null; user_agent: string | null }
        Insert: { created_at?: string; email: string; id?: string; locale?: string; source?: string | null; user_agent?: string | null }
        Update: { created_at?: string; email?: string; id?: string; locale?: string; source?: string | null; user_agent?: string | null }
        Relationships: []
      }
    }
    Views: {
      user_lifecycle: {
        Row: {
          days_since_last_analysis: number | null
          days_since_signup: number | null
          email: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_today_spend_usd: { Args: Record<string, never>; Returns: number }
      get_user_tier: { Args: { p_user_id: string }; Returns: Database["public"]["Enums"]["user_tier"] }
      try_consume_free_quota: { Args: { p_limit?: number; p_user_id: string }; Returns: boolean }
    }
    Enums: {
      doc_type:
        | "lease" | "employment_contract" | "nda" | "health_insurance" | "auto_insurance"
        | "life_insurance" | "medical_bill" | "eob" | "tax_letter" | "mortgage"
        | "terms_of_service" | "privacy_policy" | "other"
      sub_status:
        | "trialing" | "active" | "past_due" | "canceled" | "incomplete"
        | "incomplete_expired" | "unpaid" | "paused"
      user_tier: "free" | "pro" | "power" | "lifetime"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
