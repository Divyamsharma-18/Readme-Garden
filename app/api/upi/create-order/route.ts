import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const origin = new URL(request.url).origin
    const upiId = "divyam18@ptaxis"
    const amount = "399" // ₹399 for 30 days Pro access
    const transactionRef = `RG-${Date.now()}-${userId.slice(0, 8)}`

    // UPI deep link format for initiating payment
    const upiLink = `upi://pay?pa=${upiId}&pn=ReadmeGarden&am=${amount}&tn=Pro30Days&tr=${transactionRef}`

    // Web-friendly alternative: Generate a simple payment link
    // In production, you might want to use a UPI payment gateway like Razorpay, PhonePe, etc.
    const paymentLink = `${origin}/api/upi/success?userId=${encodeURIComponent(userId)}&transactionRef=${transactionRef}&amount=${amount}`

    return NextResponse.json({
      upiLink,
      paymentLink,
      transactionRef,
      amount,
      upiId,
    })
  } catch (e) {
    console.error("Create UPI order error:", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
