import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client for server-side use
// In a real app, you might use a service role key for more privileged operations
// but for basic auth, the anon key is sufficient here.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  )
}

const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Supabase sign-in error:", error.message)

      // Clean error message for user-friendly display
      let cleanErrorMessage = "Authentication failed"

      if (error.message.includes("Invalid login credentials")) {
        cleanErrorMessage = "Invalid login credentials"
      } else if (error.message.includes("Email not confirmed")) {
        cleanErrorMessage = "Please check your email to confirm your account"
      } else if (error.message.includes("Too many requests")) {
        cleanErrorMessage = "Too many login attempts. Please try again later"
      } else if (error.message.includes("User not found")) {
        cleanErrorMessage = "No account found with this email"
      }

      return NextResponse.json({ error: cleanErrorMessage }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "No user data returned after sign-in." }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email, // Use user_metadata for name
      },
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
