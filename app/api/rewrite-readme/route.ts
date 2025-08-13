import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { content, vibe, repoUrl, projectPurpose, rewriteCount } = await req.json()

  if (!content || !vibe) {
    return new Response(JSON.stringify({ error: "Missing content or vibe" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const promptVariations = [
    `Completely rewrite the following GitHub README content from scratch, focusing on the "${vibe}" vibe. Do not just rephrase; generate entirely new content. Ensure it's high-quality, engaging, and fits the specified vibe. Incorporate details from the repository URL (${repoUrl}) and project purpose (${projectPurpose || "not provided"}) if available. This is rewrite attempt number ${rewriteCount}.`,
    `Generate a fresh, new GitHub README based on the provided content and the "${vibe}" vibe. Discard the original structure and wording, creating a unique and compelling README. Consider the repository URL (${repoUrl}) and project purpose (${projectPurpose || "not provided"}). This is rewrite attempt number ${rewriteCount}.`,
    `Craft a brand new GitHub README from the ground up, adhering strictly to the "${vibe}" vibe. Do not reuse phrases or sections from the original content. Draw inspiration from the repository URL (${repoUrl}) and project purpose (${projectPurpose || "not provided"}). This is rewrite attempt number ${rewriteCount}.`,
    `Produce a completely distinct GitHub README, emphasizing the "${vibe}" vibe. The goal is a full rewrite, not an edit. Utilize information from the repository URL (${repoUrl}) and project purpose (${projectPurpose || "not provided"}) to create a superior README. This is rewrite attempt number ${rewriteCount}.`,
  ]

  const systemInstructions = `You are an expert GitHub README generator. Your task is to completely rewrite a given GitHub README from scratch based on a desired "vibe".
  You MUST generate entirely new content. Do not rephrase or modify the existing content.
  Ensure the rewritten README is high-quality, engaging, and fits the specified vibe.
  Do not include any introductory or concluding remarks outside of the README content itself.
  
  Available vibes:
  - professional: Clean, corporate, and to-the-point.
  - friendly: Professional with a warm, approachable tone.
  - humorous: Professional with jokes and wit, but still informative.
  - creative: Artistic and expressive, using unique language and structure.
  - minimal: Simple and clean, focusing on brevity and clarity.
  - detailed: Comprehensive and thorough, providing extensive information.
  
  If you cannot infer enough information from the repo URL or project purpose, use placeholder text or general best practices for that section, but always maintain the chosen vibe.
  Ensure the output is valid Markdown.
  `

  // Select a prompt variation based on rewriteCount to encourage different outputs
  const selectedPrompt = promptVariations[(rewriteCount - 1) % promptVariations.length]

  // Fallback templates for each vibe, with multiple variations
  const fallbackTemplates: { [key: string]: string[] } = {
    professional: [
      `# Professional Project\n\nThis project provides a robust solution for [problem] by leveraging [key technologies]. It aims to [goal] through its [feature A] and [feature B] capabilities.\n\n## Features\n- Feature A\n- Feature B\n\n## Installation\n\`\`\`bash\nnpm install\nnpm start\n\`\`\`\n\n## License\nMIT License`,
      `# Enterprise Solution\n\nDesigned for scalability and efficiency, this application addresses critical business needs in [domain]. It offers [core functionality] and integrates seamlessly with existing infrastructures.\n\n## Key Aspects\n- High Performance\n- Secure Data Handling\n\n## Setup\nRefer to the \`SETUP.md\` for detailed instructions.\n\n## Contact\n[Your Email]`,
    ],
    friendly: [
      `# Awesome Project! 👋\n\nHey there! This project is all about [what it does] and making your life easier. We hope you love it!\n\n## Cool Stuff It Does\n- Does X with a smile\n- Helps you with Y\n\n## Get Started\nIt's super easy!\n\`\`\`bash\ngit clone [repo]\ncd [repo]\nnpm install\nnpm run dev\n\`\`\`\n\n## License\nLicensed under MIT.`,
      `# Your New Favorite Tool ✨\n\nWelcome! This little gem helps you [solve problem] in a friendly, approachable way. We're excited for you to try it out!\n\n## What's Inside?\n- Feature 1: So simple!\n- Feature 2: Makes you happy!\n\n## How to Use\nJust follow these friendly steps!\n\n## Contributing\nWe'd love your help! See our contributing guide.`,
    ],
    humorous: [
      `# The Project That Almost Wrote Itself (It Didn't) 😂\n\nBehold! A project so revolutionary, it'll make your socks roll up and down. It's designed to [purpose] because, let's face it, life's too short for [problem].\n\n## Features (aka Superpowers)\n- Can [feature A] faster than a speeding bullet (maybe).\n- Is [feature B] more reliably than your alarm clock.\n\n## Installation (Don't Panic!)\n\`\`\`bash\n// Just kidding, it's actually easy\nnpm install\nnpm start\n\`\`\`\n\n## License\nLicensed under the "Don't Be a Jerk" license.`,
      `# My Magnum Opus (Probably) 🤪\n\nThis project is my attempt to [solve problem] without losing my sanity. It might just save yours too! Expect [unexpected feature] and a whole lot of [fun].\n\n## Why You Need This (You Do)\n- It's not a pyramid scheme.\n- It's better than doing nothing.\n\n## Setup (No Blood Sacrifices Required)\n\n## Contact\nSend memes, not hate mail.`,
    ],
    creative: [
      `# Whispers of Code 🌌\n\nIn the digital tapestry, this project weaves a narrative of [concept]. It's an exploration into [domain], manifesting as [key functionality], a symphony of logic and design.\n\n## Echoes of Functionality\n- [Abstract Feature 1]\n- [Abstract Feature 2]\n\n## Genesis\nTo awaken this digital entity:\n\`\`\`bash\nsummon project\n\`\`\`\n\n## License\nBound by the threads of creativity.`,
      `# The Canvas of Innovation 🎨\n\nBehold, a living sculpture of algorithms, designed to paint new possibilities in the realm of [field]. Each line of code a brushstroke, creating a masterpiece of [purpose].\n\n## Strokes of Genius\n- Feature A: A vibrant hue of utility.\n- Feature B: A subtle shade of efficiency.\n\n## Unveiling the Art\n\n## Patronage\nContributions are the colors to our canvas.`,
    ],
    minimal: [
      `# Project Title\n\nBrief description.\n\n## Features\n- Feature 1\n- Feature 2\n\n## Setup\n\`\`\`bash\ninstall\nrun\n\`\`\`\n\n## License\nMIT`,
      `# Core App\n\nEssential functionality for [domain].\n\n## Capabilities\n- A\n- B\n\n## Install\n\`npm i && npm start\`\n\n## Info\n[email@example.com]`,
    ],
    detailed: [
      `# Project Name: A Comprehensive Overview\n\nThis document provides an in-depth explanation of the [Project Name] project, detailing its architecture, core functionalities, and operational procedures. The primary objective of this initiative is to [elaborate purpose], addressing critical challenges within the [specific domain] landscape.\n\n## Detailed Features\n\n### Feature A: [Sub-heading]\n- Extensive explanation of Feature A.\n- Technical specifications and implementation details.\n\n### Feature B: [Sub-heading]\n- Comprehensive breakdown of Feature B.\n- Use cases and benefits.\n\n## Installation Guide\n\n### Prerequisites\n- Node.js (v18+)\n- npm (v9+)\n\n### Step-by-Step Installation\n1. Clone the repository:\n\`\`\`bash\ngit clone ${repoUrl}\n\`\`\`\n2. Navigate to the project directory:\n\`\`\`bash\ncd [project-name]\n\`\`\`\n3. Install dependencies:\n\`\`\`bash\nnpm install\n\`\`\`\n4. Configure environment variables (see \`.env.example\` for details).\n\n## Usage Instructions\n\n### Running the Application\n\`\`\`bash\nnpm start\n\`\`\`\n\n### API Endpoints\n- \`/api/data\`: Retrieves all data.\n- \`/api/data/:id\`: Retrieves specific data by ID.\n\n## Contributing to [Project Name]\n\nWe welcome contributions! Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to submit pull requests, report bugs, and suggest features.\n\n## License Information\n\nThis project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full details.\n\n## Contact and Support\n\nFor questions, support, or collaboration inquiries, please reach out to [Your Name/Team Name] at [your-email@example.com].\n\n## Acknowledgments\n\nWe extend our gratitude to the following open-source projects and resources that made [Project Name] possible:\n- [Library/Framework 1]\n- [Tool/Resource 2]\n- [Contributor 3]`,
      `# In-depth Analysis of [Project Name]\n\nThis document serves as a comprehensive resource for understanding the intricacies of the [Project Name] project. It delves into the foundational principles, architectural decisions, and operational methodologies employed to achieve its stated objectives in [domain].\n\n## Core Components\n\n### Component X\n- Detailed explanation of its role and interaction.\n\n### Component Y\n- Analysis of its design and functionality.\n\n## Deployment Strategy\n\n## Testing Procedures\n\n## Future Enhancements\n\n## Support\n\nFor technical inquiries, please consult the documentation or contact our support team.`,
    ],
  }

  try {
    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemInstructions,
      prompt: selectedPrompt + `\n\nOriginal content to be rewritten:\n\`\`\`\n${content}\n\`\`\``,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error rewriting README:", error)

    // Fallback to a generic template if AI generation fails
    const fallbackIndex = (rewriteCount - 1) % fallbackTemplates[vibe].length
    const fallbackReadme = fallbackTemplates[vibe][fallbackIndex]

    return new Response(
      JSON.stringify({ rewrittenReadme: fallbackReadme, error: "AI rewrite failed, using fallback." }),
      {
        status: 200, // Still return 200 OK, but indicate fallback
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
