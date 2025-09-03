import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { USER_TABLE } from "@/lib/user-table"

const MODE = process.env.PAYPAL_MODE || "sandbox"
const BASE = MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const SECRET = process.env.PAYPAL_SECRET

async function getAccessToken() {
  if (!CLIENT_ID || !SECRET) throw new Error("Missing PayPal credentials")
  const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString("base64")
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
  if (!res.ok) {
    const t = await res.text().catch(() => "")
    throw new Error(`Failed to get PayPal token: ${res.status} ${t}`)
  }
  const data = await res.json()
  return data.access_token as string
}

async function getOrder(token: string, orderID: string) {
  const res = await fetch(`${BASE}/v2/checkout/orders/${orderID}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) {
    console.error("PayPal get order error:", data)
    throw new Error("Failed to fetch order details")
  }
  return data
}

async function captureOrder(token: string, orderID: string) {
  const res = await fetch(`${BASE}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const data = await res.json()
  if (!res.ok) {
    // If already captured, PayPal often returns 422 with an error name
    const errName = data?.name || ""
    if (res.status === 422 && /ALREADY/.test(errName)) {
      return { alreadyCaptured: true, data }
    }
    console.error("PayPal capture error:", data)
    throw new Error("Failed to capture order")
  }
  return { alreadyCaptured: false, data }
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export async function POST(request: Request) {
  try {
    const { orderID } = await request.json()
    if (!orderID) {
      return NextResponse.json({ error: "Missing orderID" }, { status: 400 })
    }

    const token = await getAccessToken()

    // 1) Get order details to read custom_id -> our userId
    const order = await getOrder(token, orderID)
    const status: string = order?.status
    const userId: string | null = order?.purchase_units?.[0]?.custom_id || null

    if (!userId) {
      console.error("Order missing custom_id; cannot map to user")
      return NextResponse.json({ error: "Order missing user mapping" }, { status: 400 })
    }

    // 2) Capture if not completed yet
    if (status !== "COMPLETED") {
      await captureOrder(token, orderID)
    }

    // 3) Upgrade user in Supabase
    const now = new Date()
    const end = addDays(now, 30)

    const { error: upsertError } = await supabaseServer.from(USER_TABLE).upsert(
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

    if (upsertError) {
      console.error(`Supabase upsert error into "${USER_TABLE}":`, upsertError.message)
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Capture order error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Server error" }, { status: 500 })
  }
}
