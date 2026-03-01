"use client"

import { createClient, type SupabaseClient, type Session, type AuthChangeEvent } from "@supabase/supabase-js"

type MockSubscription = { unsubscribe: () => void }
type MockOnAuthChangeReturn = { data: { subscription: MockSubscription } }

function createMockSupabase(): any {
  const subscription: MockSubscription = { unsubscribe: () => {} }

  return {
    auth: {
      // Mimic supabase-js signatures we use in the app
      async getSession(): Promise<{ data: { session: Session | null }; error: null }> {
        return { data: { session: null }, error: null }
      },
      onAuthStateChange(_callback: (event: AuthChangeEvent, session: Session | null) => void): MockOnAuthChangeReturn {
        return { data: { subscription } }
      },
      async signOut(): Promise<{ error: null }> {
        return { error: null }
      },
    },
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create real client if env vars exist, otherwise fall back to a safe mock.
// This prevents crashes in preview when env vars are not configured.
export const supabase: SupabaseClient | any =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createMockSupabase()

// #region agent log
fetch("http://127.0.0.1:7462/ingest/4ef844b8-558d-459d-a120-26dd1f6b2825", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "b9e52e",
  },
  body: JSON.stringify({
    sessionId: "b9e52e",
    runId: "pre-fix",
    hypothesisId: "H1",
    location: "lib/supabase.ts:32",
    message: "supabase client init",
    data: {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
      isMock: !supabaseUrl || !supabaseAnonKey,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {})
// #endregion
