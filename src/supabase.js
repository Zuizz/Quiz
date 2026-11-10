import { createClient } from "@supabase/supabase-js";

let rawUrl = import.meta.env.VITE_SUPABASE_URL || "";
let rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Clean up surrounding quotes if any
rawUrl = rawUrl.trim().replace(/^["']|["']$/g, "");
rawKey = rawKey.trim().replace(/^["']|["']$/g, "");

// Ensure the URL does not contain /rest/v1 or trailing slash
// e.g. https://xyz.supabase.co/rest/v1/ -> https://xyz.supabase.co
let supabaseUrl = rawUrl;
try {
  if (supabaseUrl.startsWith("http")) {
    const parsed = new URL(supabaseUrl);
    supabaseUrl = parsed.origin;
  }
} catch (e) {
  console.warn("Invalid Supabase URL:", e);
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  rawKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your-project-id")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, rawKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;
