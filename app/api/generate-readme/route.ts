import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, vibe } = await request.json()

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

    // Try to fetch repository information from GitHub API (optional)
    try {
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      if (repoResponse.ok) {
        repoData = await repoResponse.json()

        // Fetch contents
        const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`)
        if (contentsResponse.ok) {
          contents = await contentsResponse.json()
        }

        // Fetch languages
        const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`)
        if (languagesResponse.ok) {
          languages = await languagesResponse.json()
        }
      }
    } catch (error) {
      console.log("GitHub API fetch failed, using defaults:", error)
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
    ${contents.length > 0 ? contents.map((item: any) => `- ${item.name} (${item.type})`).join("\n") : "- Standard project structure"}
    
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
    Return only the markdown content without any code block formatting.
    `

    // Try with OpenAI first, fallback to mock generation if API key is missing
    let text = ""

    try {
      if (process.env.OPENAI_API_KEY) {
        const result = await generateText({
          model: openai("gpt-4o"),
          prompt,
          maxTokens: 2000,
        })
        text = result.text
      } else {
        throw new Error("No OpenAI API key")
      }
    } catch (error) {
      console.log("OpenAI generation failed, using fallback:", error)

      // Fallback README generation
      text = generateFallbackReadme(repoData, vibe, languages)
    }

    return NextResponse.json({ readme: text })
  } catch (error) {
    console.error("Error generating README:", error)
    return NextResponse.json({ error: "Failed to generate README. Please try again." }, { status: 500 })
  }
}

function generateFallbackReadme(repoData: any, vibe: string, languages: any) {
  const vibeEmojis = {
    professional: "",
    friendly: "😊 ",
    humorous: "😄 ",
    creative: "🎨 ",
    minimal: "✨ ",
    detailed: "📚 ",
  }

  const emoji = vibeEmojis[vibe as keyof typeof vibeEmojis] || ""
  const primaryLanguage = Object.keys(languages)[0] || "JavaScript"

  return `# ${emoji}${repoData.name}

${repoData.description || "A fantastic project that does amazing things!"}

## 🚀 Features

- Modern ${primaryLanguage} implementation
- Easy to use and configure
- Well-documented codebase
- Active community support

## 📦 Installation

\`\`\`bash
git clone https://github.com/user/${repoData.name}.git
cd ${repoData.name}
npm install
\`\`\`

## 🔧 Usage

\`\`\`${primaryLanguage.toLowerCase()}
// Basic usage example
import { ${repoData.name} } from './${repoData.name}'

const result = ${repoData.name}()
console.log(result)
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ${repoData.license?.name || "MIT"} License.

## ⭐ Support

If you found this project helpful, please give it a star!

---

Made with ❤️ by the community`
}
