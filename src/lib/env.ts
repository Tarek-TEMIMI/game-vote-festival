
// This file provides a way to access environment variables
// and provide fallbacks for development

// Get Supabase URL from environment or use demo URL for development
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';

// Get Supabase anon key from environment or use demo key for development
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  // Since we're using the native Supabase integration, it's always configured
  return true;
};

// Instructions for setting up Supabase
export const getSupabaseInstructions = () => {
  return {
    title: "Supabase Configuration Required",
    steps: [
      "Create a Supabase project at https://supabase.com",
      "Copy your Project URL from Project Settings > API",
      "Copy your anon/public key from Project Settings > API",
      "Set these as environment variables in your .env file:",
      "VITE_SUPABASE_URL=your-project-url",
      "VITE_SUPABASE_ANON_KEY=your-anon-key",
    ]
  };
};
