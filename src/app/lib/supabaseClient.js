// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Folosește doar cheia publică pe client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
