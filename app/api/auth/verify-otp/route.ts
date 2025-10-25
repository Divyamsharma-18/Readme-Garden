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
    const { email, token } = await request.json()

    if (!email || !token) {
      return NextResponse.json({ error: "Email and OTP token are required" }, { status: 400 })
    }

    // Verify the OTP token
    const { data, error } = await supabaseServer.auth.verifyOtp({
      email,
      token,
      type: "email",
    })

    if (error) {
      console.error("OTP verification error:", error)
      let cleanErrorMessage = "Invalid or expired OTP"

      const errorText = error.message?.toLowerCase() || ""

      if (errorText.includes("expired")) {
        cleanErrorMessage = "OTP has expired. Please request a new one."
      } else if (errorText.includes("invalid")) {
        cleanErrorMessage = "Invalid OTP. Please check and try again."
      } else if (errorText.includes("mismatch")) {
        cleanErrorMessage = "OTP does not match. Please try again."
      }

      return NextResponse.json({ error: cleanErrorMessage }, { status: 401 })
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
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "OTP verification failed" }, { status: 500 })
  }
}
