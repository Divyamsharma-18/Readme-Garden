import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Simulate a delay for network request
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Simulate an existing user for conflict
    if (email === "existing@example.com") {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 })
    }

    // Simulate successful user creation
    return NextResponse.json({
      success: true,
      user: {
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID for demo
        email: email,
        name: name,
      },
    })
  } catch (error) {
    console.error("Sign up error:", error)
    return NextResponse.json({ error: "Account creation failed" }, { status: 500 })
  }
}
