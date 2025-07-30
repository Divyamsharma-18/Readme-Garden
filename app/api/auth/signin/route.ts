import { type NextRequest, NextResponse } from "next/server"

// Add a simple in-memory user store (for demonstration purposes only)
// In a real application, this would be a persistent database.
const users = new Map()

// Add a default demo user for easy testing
if (!users.has("demo@example.com")) {
  users.set("demo@example.com", {
    id: "demo-user-id",
    email: "demo@example.com",
    name: "Demo User",
    password: "demo123", // In a real app, this would be hashed
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = users.get(email)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials. User not found." }, { status: 401 })
    }


    if (user.password === password) {
      // Simple password check for demo
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    } else {
      return NextResponse.json({ error: "Invalid credentials. Incorrect password." }, { status: 401 })
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
