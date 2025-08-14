import { NextResponse } from "next/server"

<<<<<<< HEAD
// Add a simple in-memory user store (for demonstration purposes only)
// In a real application, this would be a persistent database.
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
=======
export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  // In a real application, you would:
  // 1. Validate input (e.g., email format, password strength)
  // 2. Check if the email already exists in your database
  // 3. Hash the password
  // 4. Store the new user in your database
  // 5. Create a session for the new user
>>>>>>> 3cfdf99cba412755336d5912269aaf45a17c9429

  // For this simulation, we'll just assume success
  if (name && email && password) {
    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: { username: name, email: email },
    })
  } else {
    return NextResponse.json(
      {
        success: false,
        error: "Missing name, email, or password.",
      },
      { status: 400 },
    )
  }
}
