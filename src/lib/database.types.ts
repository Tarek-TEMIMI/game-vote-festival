
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
          created_at: string
          email: string
          name: string
          role: 'player' | 'publisher' | 'admin'
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          role?: 'player' | 'publisher' | 'admin'
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          role?: 'player' | 'publisher' | 'admin'
          avatar_url?: string | null
        }
      }
      games: {
        Row: {
          id: string
          created_at: string
          name: string
          category: string
          image: string
          description: string
          publisher: string
          voting_enabled: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          category: string
          image: string
          description: string
          publisher: string
          voting_enabled?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          category?: string
          image?: string
          description?: string
          publisher?: string
          voting_enabled?: boolean
          user_id?: string
        }
      }
      contests: {
        Row: {
          id: string
          created_at: string
          name: string
          start_date: string
          end_date: string
          event_id: string | null
          voting_enabled: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          start_date: string
          end_date: string
          event_id?: string | null
          voting_enabled?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          start_date?: string
          end_date?: string
          event_id?: string | null
          voting_enabled?: boolean
          user_id?: string
        }
      }
      contest_games: {
        Row: {
          id: string
          created_at: string
          contest_id: string
          game_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          contest_id: string
          game_id: string
        }
        Update: {
          id?: string
          created_at?: string
          contest_id?: string
          game_id?: string
        }
      }
      votes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          game_id: string
          contest_id: string
          rating: number
          comment: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          game_id: string
          contest_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          game_id?: string
          contest_id?: string
          rating?: number
          comment?: string | null
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          name: string
          logo: string
          images: string[]
          start_date: string
          end_date: string
          address: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          logo: string
          images: string[]
          start_date: string
          end_date: string
          address: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          logo?: string
          images?: string[]
          start_date?: string
          end_date?: string
          address?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
