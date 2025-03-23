
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Default to empty strings to prevent hard crashes, but set a flag to show a friendly error
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are available
export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Create client 
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Tables = Database['public']['Tables'];
export type User = Tables['users']['Row'];
export type Game = Tables['games']['Row'];
export type Contest = Tables['contests']['Row'];
export type Vote = Tables['votes']['Row'];
export type Event = Tables['events']['Row'];
