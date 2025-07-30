import { type NextRequest, NextResponse } from "next/server"


const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    if (users.has(email)) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 })
    }

    // In a real app, you would hash the password before storing:
    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      name: name,
      password: password, // Storing plain password for demo, hash in real app
    }
    users.set(email, newUser)

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    })
  } catch (error) {
    console.error("Sign up error:", error)
    return NextResponse.json({ error: "Account creation failed" }, { status: 500 })
  }
}
