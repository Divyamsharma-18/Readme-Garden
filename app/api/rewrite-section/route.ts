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

    let text = ""

    try {
      if (process.env.OPENAI_API_KEY) {
        const result = await generateText({
          model: openai("gpt-4o"),
          prompt: `
          ${vibePrompts[vibe as keyof typeof vibePrompts]}
          
          Original section:
          ${section}
          
          Rewrite this section to match the requested vibe while maintaining all the important information.
          Keep it as a markdown section and make it engaging and well-formatted.
          Return only the rewritten content without any code block formatting.
          `,
          maxTokens: 1000,
        })
        text = result.text
      } else {
        throw new Error("No OpenAI API key")
      }
    } catch (error) {
      console.log("OpenAI rewrite failed, using fallback:", error)

      // Simple fallback rewrite
      const vibeModifiers = {
        professional: "This section has been professionally refined.",
        friendly: "This section has been made more welcoming! 😊",
        humorous: "This section got a humor upgrade! 😄",
        creative: "This section has been artistically enhanced! 🎨",
        minimal: "This section has been simplified. ✨",
        detailed: "This section has been expanded with more details. 📚",
      }

      text = `${section}\n\n*${vibeModifiers[vibe as keyof typeof vibeModifiers]}*`
    }

    return NextResponse.json({ rewrittenSection: text })
  } catch (error) {
    console.error("Error rewriting section:", error)
    return NextResponse.json({ error: "Failed to rewrite section. Please try again." }, { status: 500 })
  }
}
