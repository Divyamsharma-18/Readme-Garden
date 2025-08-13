import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { sectionContent, vibe, sectionName } = await req.json()

  if (!sectionContent || !vibe || !sectionName) {
    return new Response(JSON.stringify({ error: "Missing sectionContent, vibe, or sectionName" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are an expert README generator. Your task is to rewrite a specific section of a GitHub README.
      The user will provide the original content of the section, the desired vibe, and the name of the section.
      Rewrite the section from scratch, focusing on the provided vibe. Do not just rephrase; completely rewrite it.
      Ensure the rewritten section is high-quality, engaging, and fits the specified vibe.
      Do not include any introductory or concluding remarks outside of the rewritten section content.
      Do not include the section heading unless it's part of the content itself.
      
      Available vibes:
      - professional: Clean, corporate, and to-the-point.
      - friendly: Professional with a warm, approachable tone.
      - humorous: Professional with jokes and wit, but still informative.
      - creative: Artistic and expressive, using unique language and structure.
      - minimal: Simple and clean, focusing on brevity and clarity.
      - detailed: Comprehensive and thorough, providing extensive information.
      
      Example for 'professional' vibe for 'Introduction' section:
      "This project provides a robust solution for [problem] by leveraging [key technologies]. It aims to [goal] through its [feature A] and [feature B] capabilities."
      
      Example for 'humorous' vibe for 'Features' section:
      "What can this thing do? Well, besides making your coffee (not really, but we're working on it), it boasts:
      - **Feature A**: It's so good, it'll make your grandma proud.
      - **Feature B**: So intuitive, even your cat could use it (if it had opposable thumbs).
      - **Feature C**: Solves problems you didn't even know you had!"
      
      Focus solely on rewriting the content of the '${sectionName}' section based on the '${vibe}' vibe.`,
      prompt: `Rewrite the following content for the "${sectionName}" section with a "${vibe}" vibe.
      
      Original "${sectionName}" content:
      \`\`\`
      ${sectionContent}
      \`\`\`
      
      Rewritten "${sectionName}" content:`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error rewriting section:", error)
    return new Response(JSON.stringify({ error: "Failed to rewrite section." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
