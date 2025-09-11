
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are available
export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Create the Supabase client
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createClient<Database>('https://example.supabase.co', 'fake-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

// If Supabase is not configured, override the client methods with mock functions
if (!isSupabaseConfigured) {
  // Override the from method to return mock data
  const originalFrom = supabase.from;
  supabase.from = (((table: string) => {
    const mockResponse = {
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
    };
    
    return mockResponse;
  }) as unknown) as typeof originalFrom;

  // Override auth methods
  const originalAuth = supabase.auth;
  Object.assign(supabase.auth, {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
    signInWithPassword: async () => ({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: { session: null, user: null }, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
  });
}

export type Tables = Database['public']['Tables'];
export type User = Tables['users']['Row'];
export type Game = Tables['games']['Row'];
export type Contest = Tables['contests']['Row'];
export type Vote = Tables['votes']['Row'];
export type Event = Tables['events']['Row'];
