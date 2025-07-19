import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Generate JWT token
    // 3. Store session in database
    // 4. Set secure HTTP-only cookies

    // For demo purposes, we'll simulate authentication
    if (email === "demo@example.com" && password === "demo123") {
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          email: email,
          name: "Demo User",
        },
      })
    }

    // Simulate any valid email/password combination working
    return NextResponse.json({
      success: true,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split("@")[0],
      },
    })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
