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
      // Log the full error for debugging (server-side only)
      console.error("Supabase sign-in error:", error.message)

      // Return only clean, user-friendly error messages
      const errorMessage = error.message.toLowerCase()

      if (errorMessage.includes("invalid") && errorMessage.includes("credentials")) {
        return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 })
      }

      if (errorMessage.includes("email") && errorMessage.includes("not") && errorMessage.includes("confirmed")) {
        return NextResponse.json({ error: "Please check your email to confirm your account" }, { status: 401 })
      }

      if (errorMessage.includes("too many")) {
        return NextResponse.json({ error: "Too many login attempts. Please try again later" }, { status: 401 })
      }

      if (errorMessage.includes("user") && errorMessage.includes("not found")) {
        return NextResponse.json({ error: "No account found with this email" }, { status: 401 })
      }

      // Default fallback for any other error
      return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email,
      },
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
