import { NextResponse } from "next/server"

const MODE = process.env.PAYPAL_MODE || "sandbox"
const BASE = MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID
const SECRET = process.env.PAYPAL_SECRET

async function getAccessToken() {
  if (!CLIENT_ID || !SECRET) {
    throw new Error("Missing PayPal credentials")
  }
  const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString("base64")
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
  if (!res.ok) throw new Error("Failed to get PayPal token")
  const data = await res.json()
  return data.access_token as string
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const origin = new URL(request.url).origin
    const token = await getAccessToken()

    // Create a $5/month order; we treat it as a single charge that unlocks 30 days.
    const createRes = await fetch(`${BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: "5.00" },
            description: "README Garden Pro - 30 days",
            custom_id: userId, // we will use this in webhooks
          },
        ],
        application_context: {
          brand_name: "README Garden",
          user_action: "PAY_NOW",
          return_url: `${origin}/pro/success?userId=${encodeURIComponent(userId)}`,
          cancel_url: `${origin}/pro/cancel`,
        },
      }),
    })

    const order = await createRes.json()

    if (!createRes.ok) {
      console.error("PayPal create order error:", order)
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
    }

    const approvalLink = (order.links || []).find((l: any) => l.rel === "approve")?.href
    return NextResponse.json({ orderID: order.id, approvalUrl: approvalLink })
  } catch (e) {
    console.error("Create PayPal order error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
