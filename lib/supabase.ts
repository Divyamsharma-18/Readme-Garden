import { createClient } from "@supabase/supabase-js"

// Create a single Supabase client for the client-side
// This uses the anon key, which is safe to expose in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations (e.g., in API routes or Server Actions),
// you might need a service role key or a different setup if you're doing
// admin-level operations. For basic auth, the anon key is often sufficient
// when used in a secure server context.
// However, for this demo, we'll use the anon key in the API routes as well
// for simplicity, assuming the API routes are protected by Vercel's environment.
