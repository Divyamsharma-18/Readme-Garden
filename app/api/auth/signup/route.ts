import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateEmail, EMAIL_VALIDATION_ERRORS } from "@/lib/email-validation"

// Initialize Supabase client for server-side use
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
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // ── Email validation (syntax + disposable check) ──────────────────────
    const emailResult = validateEmail(email, { checkDisposable: true })
    if (!emailResult.valid) {
      return NextResponse.json(
        { error: EMAIL_VALIDATION_ERRORS[emailResult.error!] },
        { status: 400 },
      )
    }
    // Use the normalised email for all downstream operations
    const normalisedEmail = emailResult.normalised
    // ──────────────────────────────────────────────────────────────────────

    const { data, error } = await supabaseServer.auth.signUp({
      email: normalisedEmail,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      let cleanErrorMessage = "Account creation failed. Please try again."
      const errorText = error.message?.toLowerCase() || ""

      if (errorText.includes("user already registered") || errorText.includes("already registered")) {
        cleanErrorMessage = "An account with this email already exists"
      } else if (errorText.includes("password") && errorText.includes("6")) {
        cleanErrorMessage = "Password must be at least 6 characters"
      } else if (errorText.includes("invalid email")) {
        cleanErrorMessage = "Please enter a valid email address"
      }

      return NextResponse.json({ error: cleanErrorMessage }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "No user data returned after sign-up." }, { status: 400 })
    }

    // Check if email confirmation is required and pending
    if (!data.session && !data.user.email_confirmed_at) {
      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email,
        },
        message: "Please check your email to confirm your account before signing in.",
        emailConfirmationRequired: true,
      })
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
    return NextResponse.json({ error: "Account creation failed" }, { status: 500 })
  }
}
