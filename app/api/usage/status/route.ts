import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"
import { USER_TABLE } from "@/lib/user-table"

function startOfDayISO(d = new Date()) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.toISOString()
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ isPro: false, remainingToday: 0 }, { status: 200 })
    }

    const { data, error } = await supabaseServer.from(USER_TABLE).select("*").eq("id", userId).maybeSingle()

    if (error) {
      // If your table is named differently (e.g., "profiles"), set SUPABASE_USER_TABLE in your env.
      console.warn(`Supabase fetch error from table "${USER_TABLE}":`, error.message)
      return NextResponse.json({ isPro: false, remainingToday: 0 }, { status: 200 })
    }

    if (!data) {
      return NextResponse.json({ isPro: false, remainingToday: 0 }, { status: 200 })
    }

    const today = new Date()
    const nowISO = today.toISOString()
    const end = data.subscription_end ? new Date(data.subscription_end) : null
    const inWindow = end ? today < end : false
    const isPro = data.subscription_status === "pro" && inWindow

    if (!isPro) {
      return NextResponse.json({ isPro: false, remainingToday: 0 }, { status: 200 })
    }

    // Reset uses_today if last reset not today
    const lastReset = data.last_usage_reset ? new Date(data.last_usage_reset) : null
    let uses_today = data.uses_today ?? 0
    const daily_limit = data.daily_usage_limit ?? 5

    if (!lastReset || lastReset.toDateString() !== today.toDateString()) {
      const { error: upError } = await supabaseServer
        .from(USER_TABLE)
        .update({
          uses_today: 0,
          last_usage_reset: startOfDayISO(today),
          updated_at: nowISO,
        })
        .eq("id", userId)

      if (upError) {
        console.warn("Failed to reset daily usage:", upError.message)
      }
      uses_today = 0
    }

    const remainingToday = Math.max(0, daily_limit - uses_today)

    return NextResponse.json({
      isPro: true,
      remainingToday,
      dailyLimit: daily_limit,
      subscriptionEnd: data.subscription_end,
    })
  } catch (e) {
    console.error("Usage status error:", e)
    return NextResponse.json({ isPro: false, remainingToday: 0 }, { status: 200 })
  }
}
