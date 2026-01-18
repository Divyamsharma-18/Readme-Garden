import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const USER_TABLE = process.env.SUPABASE_USER_TABLE || "users"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const transactionRef = searchParams.get("transactionRef")
    const amount = searchParams.get("amount")

    if (!userId || !transactionRef) {
      return NextResponse.json(
        { error: "Missing userId or transactionRef" },
        { status: 400 }
      )
    }

    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // Update user subscription status to pro for 30 days
    const subscriptionEnd = new Date()
    subscriptionEnd.setDate(subscriptionEnd.getDate() + 30)

    const { error } = await supabase
      .from(USER_TABLE)
      .update({
        subscription_status: "pro",
        subscription_end: subscriptionEnd.toISOString(),
        uses_today: 0,
      })
      .eq("id", userId)

    if (error) {
      console.error("Failed to update subscription:", error)
      return NextResponse.json(
        { error: "Failed to process payment" },
        { status: 500 }
      )
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL(
        `/pro/success?token=${transactionRef}&method=upi&amount=${amount}`,
        request.url
      )
    )
  } catch (e) {
    console.error("UPI success handler error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
