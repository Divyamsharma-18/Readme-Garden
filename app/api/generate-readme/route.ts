import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, vibe, liveDemoUrl, projectPurpose } = await request.json()

    if (!repoUrl || !vibe) {
      return NextResponse.json({ error: "Repository URL and vibe are required" }, { status: 400 })
    }

    // Extract repo info from URL
    const urlParts = repoUrl.replace("https://github.com/", "").split("/")
    const owner = urlParts[0]
    const repo = urlParts[1]

    if (!owner || !repo) {
      return NextResponse.json({ error: "Invalid GitHub repository URL" }, { status: 400 })
    }

    let repoData = {
      name: repo,
      description: "A GitHub repository",
      language: "JavaScript",
      stargazers_count: 0,
      forks_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      homepage: null,
      topics: [],
      license: null,
    }

    let contents = []
    let languages = { JavaScript: 100 }
    let existingReadmeContent = ""
    let packageJsonContent: Record<string, any> = {}
    let liveDemoTitle: string | null = null
    let liveDemoMetaDescription: string | null = null

    // Try to fetch repository information from GitHub API (optional)
    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if (repoResponse.ok) {
        repoData = await repoResponse.json()

        // Fetch contents (top-level files/folders)
        const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`)
        if (contentsResponse.ok) {
          contents = await contentsResponse.json()
        }

        // Fetch languages
        const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`)
        if (languagesResponse.ok) {
          languages = await languagesResponse.json()
        }

        // Attempt to fetch existing README.md content
        const readmeFile = contents.find((item: any) => item.name.toLowerCase() === "readme.md" && item.type === "file")
        if (readmeFile && readmeFile.download_url) {
          const readmeResponse = await fetch(readmeFile.download_url)
          if (readmeResponse.ok) {
            existingReadmeContent = await readmeResponse.text()
          }
        }

        // Attempt to fetch package.json content
        const packageJsonFile = contents.find(
          (item: any) => item.name.toLowerCase() === "package.json" && item.type === "file",
        )
        if (packageJsonFile && packageJsonFile.download_url) {
          const packageJsonResponse = await fetch(packageJsonFile.download_url)
          if (packageJsonResponse.ok) {
            try {
              packageJsonContent = await packageJsonResponse.json()
            } catch (parseError) {
              console.warn("Failed to parse package.json:", parseError)
            }
          }
        }
      }
    } catch (error) {
      console.log("GitHub API fetch failed, using defaults:", error)
    }

    // Attempt to fetch and parse live demo URL for title and meta description
    if (liveDemoUrl) {
      try {
        const liveDemoResponse = await fetch(liveDemoUrl)
        if (liveDemoResponse.ok) {
          const htmlContent = await liveDemoResponse.text()
          // Extract title
          const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i)
          if (titleMatch && titleMatch[1]) {
            liveDemoTitle = titleMatch[1].trim()
          }
          // Extract meta description
          const metaDescriptionMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)
          if (metaDescriptionMatch && metaDescriptionMatch[1]) {
            liveDemoMetaDescription = metaDescriptionMatch[1].trim()
          }
        } else {
          console.warn(`Failed to fetch live demo URL ${liveDemoUrl}: ${liveDemoResponse.status}`)
        }
      } catch (error) {
        console.warn(`Error fetching or parsing live demo URL ${liveDemoUrl}:`, error)
      }
    }

    const result = await streamText({
      model: openai("gpt-4o"),
      system: `You are an expert GitHub README generator. Your task is to create a comprehensive and engaging README based on a given GitHub repository URL, a desired "vibe", an optional live demo URL, and an optional project purpose/description.

      Your README should include the following sections, in this order:
      1.  **Project Title and Description**: A clear, concise title and a compelling description of the project. Incorporate the project purpose if provided.
      2.  **Features**: A bulleted list of key features. Infer features from the repository if no specific purpose is given, otherwise, highlight features relevant to the purpose.
      3.  **Live Demo (if provided)**: A link to the live demo.
      4.  **Installation**: Clear, step-by-step instructions on how to set up and run the project locally. Include prerequisites if necessary.
      5.  **Usage**: Examples or instructions on how to use the project.
      6.  **Contributing**: Guidelines for how others can contribute to the project.
      7.  **License**: Information about the project's license.
      8.  **Contact**: How to get in touch with the project maintainers.
      9.  **Acknowledgments**: Any resources, libraries, or individuals to thank.

      Tailor the language, tone, and depth of each section to match the specified "vibe".

      Available vibes:
      - professional: Clean, corporate, and to-the-point.
      - friendly: Professional with a warm, approachable tone.
      - humorous: Professional with jokes and wit, but still informative.
      - creative: Artistic and expressive, using unique language and structure.
      - minimal: Simple and clean, focusing on brevity and clarity.
      - detailed: Comprehensive and thorough, providing extensive information.

      If you cannot infer enough information from the repo URL or project purpose, use placeholder text or general best practices for that section, but always maintain the chosen vibe.
      Ensure the output is valid Markdown. Do not include any conversational text outside the README content.
      `,
      prompt: `Generate a GitHub README for the repository at: ${repoUrl}
      Desired vibe: ${vibe}
      ${liveDemoUrl ? `Live Demo URL: ${liveDemoUrl}` : ""}
      ${projectPurpose ? `Project Purpose/Description: ${projectPurpose}` : ""}
      `,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating README:", error)
    return new Response(JSON.stringify({ error: "Failed to generate README." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
