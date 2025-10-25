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

    console.log(`Attempting to send OTP to: ${email}`)

    // Send OTP with timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const { data, error } = await supabaseServer.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      })

      clearTimeout(timeoutId)

      if (error) {
        console.error("OTP request error:", error)

        let cleanErrorMessage = "Failed to send OTP. Please try again."

        const errorText = error.message?.toLowerCase() || ""
        const errorCode = (error as any)?.code?.toLowerCase() || ""

        if (errorText.includes("user not found") || errorText.includes("not found")) {
          cleanErrorMessage = "No account found with this email. Please sign up first."
        } else if (errorText.includes("too many")) {
          cleanErrorMessage = "Too many attempts. Please wait a few minutes and try again."
        } else if (errorText.includes("invalid email")) {
          cleanErrorMessage = "Please enter a valid email address."
        } else if (errorCode.includes("timeout") || errorText.includes("timeout")) {
          cleanErrorMessage = "Request timed out. Please check your email settings and try again."
        } else if (errorCode.includes("unexpected_failure") || errorText.includes("unexpected")) {
          cleanErrorMessage = "Email service error. Please verify SMTP settings in Supabase dashboard and try again."
        }

        return NextResponse.json({ error: cleanErrorMessage }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: "OTP sent to your email. Please check your inbox and spam folder.",
      })
    } catch (timeoutError) {
      clearTimeout(timeoutId)
      console.error("OTP request timeout or error:", timeoutError)

      return NextResponse.json(
        {
          error:
            "Request timed out. Please verify your SMTP settings in Supabase dashboard are configured correctly and try again.",
        },
        { status: 504 },
      )
    }
  } catch (error) {
    console.error("OTP request error:", error)
    return NextResponse.json({ error: "Failed to send OTP. Please try again later." }, { status: 500 })
  }
}
