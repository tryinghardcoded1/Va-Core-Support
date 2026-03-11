import { createClient } from "@supabase/supabase-js";

// Use environment variables with fallbacks for development
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that the URL is actually a URL, otherwise use fallback
const SUPABASE_URL = (rawUrl && rawUrl.startsWith('http')) 
  ? rawUrl 
  : "https://eniwuiolxxswnuxhhtcw.supabase.co";

// Use provided key or fallback
const SUPABASE_PUBLIC_KEY = (rawKey && rawKey.length > 20)
  ? rawKey
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaXd1aW9seHhzd251eGhodGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1NjY0MDAsImV4cCI6MjAyNzE0MjQwMH0.example_key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
