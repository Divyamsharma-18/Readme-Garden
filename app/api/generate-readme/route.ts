import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, vibe } = await request.json()

    if (!repoUrl || !vibe) {
      return NextResponse.json({ error: "Repository URL and vibe are required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Extract repo info from URL
    const urlParts = repoUrl.replace("https://github.com/", "").split("/")
    const owner = urlParts[0]
    const repo = urlParts[1]

    if (!owner || !repo) {
      return NextResponse.json({ error: "Invalid GitHub repository URL" }, { status: 400 })
    }

    // Fetch repository information from GitHub API
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`)

    if (!repoResponse.ok) {
      return NextResponse.json({ error: "Repository not found or is private" }, { status: 404 })
    }

    const repoData = await repoResponse.json()

    // Fetch repository contents to understand the project structure
    const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`)
    let contents = []

    if (contentsResponse.ok) {
      contents = await contentsResponse.json()
    }

    // Fetch languages used in the repository
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`)
    let languages = {}

    if (languagesResponse.ok) {
      languages = await languagesResponse.json()
    }

    // Generate README based on vibe
    const vibePrompts = {
      professional: "Create a professional, corporate-style README that's clean and to-the-point.",
      friendly: "Create a professional README with a warm, welcoming tone.",
      humorous: "Create a professional README with jokes, wit, and humor sprinkled throughout.",
      creative: "Create an artistic and expressive README with creative formatting and emojis.",
      minimal: "Create a simple, clean, and minimal README with just the essentials.",
      detailed: "Create a comprehensive and thorough README with extensive documentation.",
    }

    const prompt = `
    ${vibePrompts[vibe as keyof typeof vibePrompts]}
    
    Repository Information:
    - Name: ${repoData.name}
    - Description: ${repoData.description || "No description provided"}
    - Language: ${repoData.language || "Not specified"}
    - Languages used: ${Object.keys(languages).join(", ") || "Not available"}
    - Stars: ${repoData.stargazers_count}
    - Forks: ${repoData.forks_count}
    - Created: ${new Date(repoData.created_at).toLocaleDateString()}
    - Last updated: ${new Date(repoData.updated_at).toLocaleDateString()}
    - Homepage: ${repoData.homepage || "None"}
    - Topics: ${repoData.topics?.join(", ") || "None"}
    - License: ${repoData.license?.name || "Not specified"}
    
    Project Structure:
    ${contents.map((item: any) => `- ${item.name} (${item.type})`).join("\n")}
    
    Create a complete README.md file that includes:
    1. Project title and description
    2. Installation instructions
    3. Usage examples
    4. Features list
    5. Contributing guidelines
    6. License information
    7. Contact/support information
    
    Make it engaging and match the requested vibe. Use proper markdown formatting.
    Include badges, emojis (if appropriate for the vibe), and make it visually appealing.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
    })

    return NextResponse.json({ readme: text })
  } catch (error) {
    console.error("Error generating README:", error)
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 })
  }
}
