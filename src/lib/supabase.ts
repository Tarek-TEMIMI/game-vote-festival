
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are available
export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Create a mock client that returns empty results for all operations when not configured
const createMockClient = () => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Supabase not configured') }),
          in: async () => ({ data: [], error: new Error('Supabase not configured') }),
        }),
        in: async () => ({ data: [], error: new Error('Supabase not configured') }),
      }),
      insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
      update: async () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: async () => ({ data: null, error: new Error('Supabase not configured') }),
    }),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
      signInWithPassword: async () => ({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
      signUp: async () => ({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
    },
  };
};

// Create client or use mock client if not configured
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient() as ReturnType<typeof createClient<Database>>;

export type Tables = Database['public']['Tables'];
export type User = Tables['users']['Row'];
export type Game = Tables['games']['Row'];
export type Contest = Tables['contests']['Row'];
export type Vote = Tables['votes']['Row'];
export type Event = Tables['events']['Row'];
