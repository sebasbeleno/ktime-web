import { createClient } from "@supabase/supabase-js";

export const supabaseLocalClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
