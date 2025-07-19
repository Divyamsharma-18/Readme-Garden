import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { section, vibe } = await request.json()

    if (!section || !vibe) {
      return NextResponse.json({ error: "Section content and vibe are required" }, { status: 400 })
    }

    const vibePrompts = {
      professional: "Rewrite this section in a professional, corporate style that's clean and to-the-point.",
      friendly: "Rewrite this section with a warm, welcoming, and friendly professional tone.",
      humorous: "Rewrite this section with humor, wit, and jokes while maintaining professionalism.",
      creative: "Rewrite this section with artistic flair, creative formatting, and expressive language.",
      minimal: "Rewrite this section to be simple, clean, and minimal with just the essentials.",
      detailed: "Rewrite this section to be comprehensive, thorough, and extensively detailed.",
    }

    const prompt = `
    ${vibePrompts[vibe as keyof typeof vibePrompts]}
    
    Original section:
    ${section}
    
    Rewrite this section to match the requested vibe while maintaining all the important information.
    Keep it as a markdown section and make it engaging and well-formatted.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1000,
    })

    return NextResponse.json({ rewrittenSection: text })
  } catch (error) {
    console.error("Error rewriting section:", error)
    return NextResponse.json({ error: "Failed to rewrite section" }, { status: 500 })
  }
}
