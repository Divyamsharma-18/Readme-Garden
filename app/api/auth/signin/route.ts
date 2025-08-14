import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Simulate a delay for network request
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Hardcoded demo user for sign-in simulation
    if (email === "demo@example.com" && password === "demo123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "demo-user-id",
          email: "demo@example.com",
          name: "Demo User",
        },
      })
    } else {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
