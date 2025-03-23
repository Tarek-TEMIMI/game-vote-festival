
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Tables = Database['public']['Tables'];
export type User = Tables['users']['Row'];
export type Game = Tables['games']['Row'];
export type Contest = Tables['contests']['Row'];
export type Vote = Tables['votes']['Row'];
export type Event = Tables['events']['Row'];
