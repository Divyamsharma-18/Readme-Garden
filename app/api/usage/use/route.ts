import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { USER_TABLE } from "@/lib/user-table"

function startOfDayISO(d = new Date()) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.toISOString()
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const { data, error } = await supabaseServer.from(USER_TABLE).select("*").eq("id", userId).maybeSingle()

    if (error) {
      console.warn(`Supabase fetch error from table "${USER_TABLE}":`, error.message)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const now = new Date()
    const end = data.subscription_end ? new Date(data.subscription_end) : null
    const isPro = data.subscription_status === "pro" && end && now < end

    if (!isPro) {
      return NextResponse.json({ error: "User is not Pro" }, { status: 403 })
    }

    const dailyLimit = data.daily_usage_limit ?? 5
    let usesToday = data.uses_today ?? 0

    const lastReset = data.last_usage_reset ? new Date(data.last_usage_reset) : null
    if (!lastReset || lastReset.toDateString() !== now.toDateString()) {
      usesToday = 0
    }

    if (usesToday >= dailyLimit) {
      return NextResponse.json({ error: "Daily usage limit reached" }, { status: 429 })
    }

    const { error: upError } = await supabaseServer
      .from(USER_TABLE)
      .update({
        uses_today: usesToday + 1,
        last_usage_reset: startOfDayISO(now),
        updated_at: now.toISOString(),
      })
      .eq("id", userId)

    if (upError) {
      return NextResponse.json({ error: "Failed to update usage" }, { status: 500 })
    }

    return NextResponse.json({ success: true, remainingToday: Math.max(0, dailyLimit - (usesToday + 1)) })
  } catch (e) {
    console.error("Use feature error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
