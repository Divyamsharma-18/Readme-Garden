import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // In a real application, you would:
  // 1. Hash the password
  // 2. Query your database to find a user with the given email
  // 3. Compare the hashed password with the stored hash
  // 4. If valid, create a session (e.g., using JWTs or session cookies)

  // For this simulation, we'll just check for a hardcoded user
  if (email === "test@example.com" && password === "password123") {
    return NextResponse.json({
      success: true,
      message: "Sign in successful!",
      user: { username: "TestUser", email: "test@example.com" },
    })
  } else {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid email or password.",
      },
      { status: 401 },
    )
  }
}
