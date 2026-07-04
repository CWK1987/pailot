import { createClient } from "@supabase/supabase-js";

// These two values come from your Supabase project (Settings -> API).
// They are safe to expose in frontend code — unlike the Anthropic key, these
// are designed to be public; real security comes from Supabase's Row Level
// Security rules (set up by the SQL script in supabase-setup.sql).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
