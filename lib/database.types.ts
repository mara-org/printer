export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          cost_usd: number | null
          created_at: string
          document_id: string
          id: string
          input_tokens: number | null
          key_terms: Json
          model: string | null
          output_locale: string
          output_tokens: number | null
          questions: Json
          risks: Json
          summary: string | null
          user_id: string
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          document_id: string
          id?: string
          input_tokens?: number | null
          key_terms?: Json
          model?: string | null
          output_locale: string
          output_tokens?: number | null
          questions?: Json
          risks?: Json
          summary?: string | null
          user_id: string
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          document_id?: string
          id?: string
          input_tokens?: number | null
          key_terms?: Json
          model?: string | null
          output_locale?: string
          output_tokens?: number | null
          questions?: Json
          risks?: Json
          summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: true
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          byte_size: number | null
          created_at: string
          detected_type: Database["public"]["Enums"]["doc_type"] | null
          id: string
          mime_type: string | null
          original_filename: string | null
          purge_at: string
          source_locale: string | null
          status: string
          storage_path: string
          user_id: string
        }
        Insert: {
          byte_size?: number | null
          created_at?: string
          detected_type?: Database["public"]["Enums"]["doc_type"] | null
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          purge_at?: string
          source_locale?: string | null
          status?: string
          storage_path: string
          user_id: string
        }
        Update: {
          byte_size?: number | null
          created_at?: string
          detected_type?: Database["public"]["Enums"]["doc_type"] | null
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          purge_at?: string
          source_locale?: string | null
          status?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          free_docs_reset_at: string
          free_docs_used: number
          id: string
          preferred_locale: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          free_docs_reset_at?: string
          free_docs_used?: number
          id: string
          preferred_locale?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          free_docs_reset_at?: string
          free_docs_used?: number
          id?: string
          preferred_locale?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          current_period_end: string | null
          price_id: string | null
          status: Database["public"]["Enums"]["sub_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["sub_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          current_period_end?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["sub_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          locale: string
          source: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          locale?: string
          source?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          locale?: string
          source?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      doc_type:
        | "lease"
        | "employment_contract"
        | "nda"
        | "health_insurance"
        | "auto_insurance"
        | "life_insurance"
        | "medical_bill"
        | "eob"
        | "tax_letter"
        | "mortgage"
        | "terms_of_service"
        | "privacy_policy"
        | "other"
      sub_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
