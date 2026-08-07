import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateEmail, EMAIL_VALIDATION_ERRORS } from "@/lib/email-validation"

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

    // ── Syntax-only validation on sign-in (no disposable check) ──────────
    // We intentionally skip the disposable check here so that any user who
    // already holds a legitimate account can always sign in regardless of
    // whether their domain was later added to the blocklist.
    const emailResult = validateEmail(email, { checkDisposable: false })
    if (!emailResult.valid) {
      return NextResponse.json(
        { error: EMAIL_VALIDATION_ERRORS[emailResult.error!] },
        { status: 400 },
      )
    }
    const normalisedEmail = emailResult.normalised
    // ──────────────────────────────────────────────────────────────────────

    const { data, error } = await supabaseServer.auth.signInWithPassword({
      email: normalisedEmail,
      password,
    })

    if (error) {
      let cleanErrorMessage = "Invalid login credentials"
      const errorText = error.message?.toLowerCase() || ""

      if (errorText.includes("email") && errorText.includes("not") && errorText.includes("confirmed")) {
        cleanErrorMessage = "Please check your email to confirm your account"
      } else if (errorText.includes("too many")) {
        cleanErrorMessage = "Too many login attempts. Please try again later"
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
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
