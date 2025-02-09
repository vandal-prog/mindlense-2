export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          risk_level: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
          risk_level?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          risk_level?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          session_id: string
          content: string
          type: 'user' | 'ai'
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          content: string
          type: 'user' | 'ai'
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          content?: string
          type?: 'user' | 'ai'
          created_at?: string
        }
      }
      mood_checks: {
        Row: {
          id: string
          user_id: string
          score: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}