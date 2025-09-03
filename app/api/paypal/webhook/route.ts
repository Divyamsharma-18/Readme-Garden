import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { USER_TABLE } from "@/lib/user-table"

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

// Minimal webhook handler (add signature verification in production)
export async function POST(request: Request) {
  try {
    const event = await request.json()

    if (event?.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ received: true })
    }

    const userId =
      event?.resource?.purchase_units?.[0]?.custom_id ||
      event?.resource?.supplementary_data?.related_ids?.custom_id ||
      null

    if (!userId) {
      console.warn("Webhook completed but no custom_id found")
      return NextResponse.json({ received: true })
    }

    const now = new Date()
    const end = addDays(now, 30)

    const { error } = await supabaseServer.from(USER_TABLE).upsert(
      {
        id: userId,
        subscription_status: "pro",
        subscription_start: now.toISOString(),
        subscription_end: end.toISOString(),
        daily_usage_limit: 5,
        uses_today: 0,
        last_usage_reset: new Date(now.setHours(0, 0, 0, 0)).toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )

    if (error) {
      console.error(`Supabase upsert error (webhook) into "${USER_TABLE}":`, error.message)
    }

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error("PayPal webhook error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
