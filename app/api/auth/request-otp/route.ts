import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Send OTP via Supabase signInWithOtp
    // Make sure your Supabase email template uses {{ .Token }} not {{ .SiteURL }}
    const { data, error } = await supabaseServer.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) {
      console.error("OTP request error:", error)
      let cleanErrorMessage = "Failed to send OTP. Please try again."

      const errorText = error.message?.toLowerCase() || ""

      if (errorText.includes("user not found") || errorText.includes("not found")) {
        cleanErrorMessage = "No account found with this email. Please sign up first."
      } else if (errorText.includes("too many")) {
        cleanErrorMessage = "Too many attempts. Please try again later."
      } else if (errorText.includes("invalid email")) {
        cleanErrorMessage = "Please enter a valid email address."
      }

      return NextResponse.json({ error: cleanErrorMessage }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email. Please check your inbox.",
    })
  } catch (error) {
    console.error("OTP request error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
