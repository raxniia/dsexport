import { createClient } from "@supabase/supabase-js";

// Publishable (public) values — safe to ship to the browser. RLS protects the data.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ejzixksomjkrzhnvfwif.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_DgNQiB04xrJa7q2LV1diuA_bn7_B853";

export const supabase = createClient(url, key, { auth: { persistSession: false } });
