import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { content, vibe, repoUrl, projectPurpose } = await request.json() // Receive projectPurpose here

    if (!content || !vibe) {
      return NextResponse.json({ error: "Content and vibe are required" }, { status: 400 })
    }

    const vibePrompts = {
      professional: `Completely rewrite this README in a PROFESSIONAL, corporate style. Make it formal, business-oriented, and technically precise. Use corporate language, formal structure, and professional terminology. Remove any casual language or emojis.`,

      friendly: `Completely rewrite this README in a FRIENDLY, welcoming tone. Make it conversational, warm, and approachable. Use encouraging language, helpful tips, and a community-focused approach. Add friendly emojis where appropriate.`,

      humorous: `Completely rewrite this README with HUMOR and wit. Add jokes, puns, funny analogies, and entertaining commentary while keeping it informative. Make it fun to read with clever wordplay and amusing examples.`,

      creative: `Completely rewrite this README in a CREATIVE, artistic style. Use expressive language, creative metaphors, visual elements, and artistic formatting. Make it visually stunning and uniquely expressive.`,

      minimal: `Completely rewrite this README in a MINIMAL, clean style. Make it concise, direct, and simple. Remove unnecessary words, keep only essential information, and use clean, uncluttered formatting.`,

      detailed: `Completely rewrite this README in a DETAILED, comprehensive style. Add extensive explanations, thorough documentation, in-depth examples, and comprehensive coverage of all aspects. Make it educational and thorough.`,
    }

    let rewrittenReadme = ""

    try {
      if (process.env.OPENAI_API_KEY) {
        const result = await generateText({
          model: openai("gpt-4o"),
          prompt: `
          ${vibePrompts[vibe as keyof typeof vibePrompts]}
          
          Original README content to be completely rewritten:
          ${content}
          
          ${repoUrl ? `The original repository URL was: ${repoUrl}. Use this for installation instructions.` : ""}
          ${projectPurpose ? `The user provided this project purpose: "${projectPurpose}". Incorporate this as the core description.` : ""}

          IMPORTANT: Create a COMPLETELY NEW VERSION of this README. Do NOT just modify or append to the original. Write it from scratch, ensuring it strongly reflects the ${vibe} style in tone, structure, and formatting. All original important information must be retained but presented in a fresh, new way.
          The project's core purpose/description (the first main section after the title) MUST be highly compelling, benefit-oriented, and 'sell' the project, elaborating on its value based on the provided content and the chosen vibe.
          Return ONLY the rewritten README content in markdown format, without any additional text or code block formatting around it.
          `,
          maxTokens: 2500,
          temperature: 0.9, // Higher temperature for more distinct rewrites
        })
        rewrittenReadme = result.text
      } else {
        throw new Error("No OpenAI API key")
      }
    } catch (error) {
      console.log("OpenAI rewrite failed, using enhanced fallback:", error)

      // Enhanced fallback rewrite that actually changes the content
      rewrittenReadme = enhancedFallbackRewrite(content, vibe, repoUrl, projectPurpose) // Pass repoUrl to fallback
    }

    return NextResponse.json({ rewrittenReadme })
  } catch (error) {
    console.error("Error rewriting README:", error)
    return NextResponse.json({ error: "Failed to rewrite README. Please try again." }, { status: 500 })
  }
}

function enhancedFallbackRewrite(originalContent: string, vibe: string, repoUrl?: string, projectPurpose?: string) {
  // Extract key information from original content
  const lines = originalContent.split("\n")
  const titleLine = lines.find((line) => line.startsWith("#"))
  const projectName = titleLine
    ? titleLine
        .replace(/^#+\s*/, "")
        .replace(/[^\w\s]/g, "")
        .trim()
    : "Project"

  // Attempt to extract a brief tagline from the original content or use projectPurpose
  let briefTagline = projectPurpose || ""
  if (!briefTagline) {
    const firstParagraphMatch = originalContent.match(/#+\s*.*?\n\n([^\n]+)/)
    if (firstParagraphMatch && firstParagraphMatch[1]) {
      briefTagline = firstParagraphMatch[1].trim()
    } else {
      briefTagline = "A simple, efficient solution designed for clarity and directness."
    }
  }

  // Enhance the description with "selling" language for fallback
  let compellingDescription = briefTagline
  if (briefTagline.length > 0) {
    switch (vibe) {
      case "professional":
        compellingDescription = `Unlock the full potential of your workflow with this robust solution. ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This cutting-edge solution")}.`
        break
      case "friendly":
        compellingDescription = `Get ready to simplify your life and boost your productivity! ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This friendly tool")}.`
        break
      case "humorous":
        compellingDescription = `Tired of the same old problems? This project is here to save the day (and maybe make you chuckle)! ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This hilarious yet powerful tool")}.`
        break
      case "creative":
        compellingDescription = `Dive into a world where innovation meets artistry. ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This visionary creation")}.`
        break
      case "minimal":
        compellingDescription = `Achieve more with less. ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This streamlined solution")}.`
        break
      case "detailed":
        compellingDescription = `Explore the depths of comprehensive functionality. ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This meticulously crafted system")}.`
        break
      default:
        compellingDescription = `Discover the power of this innovative project. ${briefTagline}.`
    }
  } else {
    compellingDescription =
      "This project is designed to empower your development journey, offering innovative solutions and seamless integration."
  }

  // Attempt to extract primary language from original content
  let primaryLanguage = "JavaScript" // Default
  const primaryLanguageMatch = originalContent.match(/Primary Language:\s*(.*?)\n/)
  if (primaryLanguageMatch && primaryLanguageMatch[1]) {
    primaryLanguage = primaryLanguageMatch[1].trim()
  }

  // Attempt to extract a live demo URL if present in the original content
  const liveDemoMatch = originalContent.match(/\[.*? Live\]$$(https?:\/\/[^\s]+)$$/)
  const liveDemoUrl = liveDemoMatch ? liveDemoMatch[1] : undefined

  const liveDemoSection = liveDemoUrl
    ? `
## Live Demo 🚀

Experience the project live here: [${projectName} Live](${liveDemoUrl})
`
    : ""

  // Determine the clone URL for fallback
  let cloneUrl = "<repository-url>" // Default placeholder
  if (repoUrl) {
    cloneUrl = repoUrl
  } else {
    // Try to infer from original content if repoUrl wasn't passed
    const gitCloneMatch = originalContent.match(/git clone\s+(https?:\/\/github\.com\/[^\s]+)/)
    if (gitCloneMatch && gitCloneMatch[1]) {
      cloneUrl = gitCloneMatch[1]
    }
  }

  const vibeRewrites = {
    professional: `# ${projectName}

${compellingDescription}

## Technical Specifications

- **Primary Technology**: ${primaryLanguage}
- **Architecture**: Modern, scalable design ensuring high performance and maintainability.
- **Implementation**: Industry-standard practices for secure and efficient operation.
- **Compatibility**: Engineered for cross-platform support, ensuring broad applicability.
${liveDemoSection}
## Installation Procedures

To set up the project, follow these steps:

\`\`\`bash
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}
npm install --production
\`\`\`

## Implementation Guidelines

For detailed implementation procedures and integration instructions, please refer to the comprehensive technical documentation provided within the repository.

## Corporate Contribution Standards

All contributions must adhere to established coding standards, undergo rigorous testing, and pass a thorough code review process to maintain project integrity and quality.

---

© 2024 ${projectName} Development Team. All rights reserved.`,

    friendly: `# Welcome to ${projectName}! 👋

${compellingDescription} We hope you'll find it useful!

## Getting Started (It's Super Easy!) 🚀

Ready to dive in? Here's how to get our project up and running on your machine:

\`\`\`bash
# First, let's get the code onto your computer
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}

# Now, install all the necessary bits and bobs (grab a coffee while this runs!)
npm install
\`\`\`

Don't worry if you're new to this - we've all been there! If you get stuck, just ask!

## How to Use It 🤝

We've made this as simple as possible. Just follow along with our examples, and you'll be up and running in no time!

## Want to Help Out? We'd Love That! 💝

We're always excited to welcome new contributors! Here's how you can join our friendly community:

1. Fork this repo (you've got this!)
2. Create your feature branch
3. Make your awesome changes
4. Share it with us via a pull request

Don't be shy - we're here to help if you get stuck! 

## Questions? We're Here for You! 🤗

Feel free to reach out anytime - we love hearing from our users!

Made with ❤️ by our amazing community`,

    humorous: `# ${projectName} 🎭

*Because boring code is so last century and we like a little pizzazz!* 😎

${compellingDescription}

## Installation (AKA "The Ancient Ritual") 🧙‍♂️

Prepare yourself, for the ancient texts (and a few commands) await!

\`\`\`bash
# Step 1: Summon the code from the digital realm
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}

# Step 2: Feed the hungry dependencies (they're very particular about their snacks)
npm install
\`\`\`

⚠️ **Warning**: Side effects may include uncontrollable productivity and spontaneous "aha!" moments. Proceed with caution (or don't, we're not your boss).

## Usage (The Fun Part!) 🎪

Using this is easier than explaining why we have so many JavaScript frameworks. Just point, click, and let the magic happen!

## Contributing (Join Our Circus!) 🎪

Want to add your own brand of glorious chaos? We love chaos! The more, the merrier!

1. Fork it (like a road, but for code, and less confusing)
2. Branch it (like a tree, but digital, and hopefully less prone to squirrels)
3. Code it (like a boss, or at least someone who knows what they're doing)
4. Push it (real good)
5. PR it (and we'll probably love it, unless it breaks everything, then we'll still love you, but maybe less the code)

## Bugs? What Bugs? 🐛

They're not bugs, they're *undocumented features* that add character. But if you find any "features" that seem a *little* too creative, let us know! We're always up for a good laugh (and a fix).

---

*Disclaimer: No developers were harmed in the making of this README. Side effects may include uncontrollable coding, dad jokes, and a sudden urge to optimize everything. Results may vary. Void where prohibited by law or common sense.*`,

    creative: `# ✨ ${projectName} ✨
*Where Code Meets Art, and Dreams Take Flight*

${compellingDescription}

## 🌟 The Vision Unfolds

Crafted with meticulous care, this project represents the vibrant intersection of:
- 💡 **Innovation**: Pushing the boundaries of what's possible.
- 🎯 **Purpose**: Designed with a clear mission to inspire and empower.
- 🚀 **Excellence**: Built with a commitment to quality and performance.
- 🌈 **Creativity**: Infused with unique flair and artistic expression.

## 🎭 Installation Symphony

Prepare to embark on a journey of creation. The installation is but the first movement of our grand symphony:

\`\`\`bash
# 🎼 First Movement: The Acquisition of the Sacred Texts
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}

# 🎵 Second Movement: The Preparation of the Canvas and Tools
npm install
\`\`\`

## 🎪 The Performance Begins

Witness as your ideas transform into breathtaking reality through the magic of code. Each interaction is a brushstroke, each function a note in a harmonious composition.

## 🤝 Join the Creative Collective

We invite you to become part of our artistic journey. Your unique perspective is a valuable addition to our collective masterpiece:

🎯 **Fork** → Create your own interpretation, a new branch on the tree of ideas.
🌱 **Branch** → Nurture your ideas, letting them grow and flourish.
🎨 **Create** → Express your vision, paint your unique contribution.
🚀 **Share** → Inspire others, let your creativity ignite new sparks.

## 🌈 Connect With Us

We believe in the profound power of creative collaboration. Reach out and let's create something truly beautiful and impactful together!

---

*"Code is poetry written in logic, and logic is the brush of the digital artist."* - The ${projectName} Collective`,

    minimal: `# ${projectName}

${compellingDescription}
${liveDemoSection}
## Install

To get started, clone the repository and install dependencies:

\`\`\`bash
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}
npm install
\`\`\`

## Use

Refer to the concise documentation for usage examples.

## Contribute

Contributions are welcome. Follow these steps:
1. Fork
2. Branch
3. Code
4. PR

## License

This project is released under the ${originalContent.includes("License") ? originalContent.split("## License")[1]?.split("\n")[1]?.trim() : "MIT"} License.`,

    detailed: `# ${projectName} - Comprehensive Documentation 📚

## Table of Contents 📋
1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [API Reference](#api-reference)
7. [Contributing](#contributing)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [License](#license)
${liveDemoUrl ? "11. [Live Demonstration](#live-demonstration)" : ""}

## Overview 🔍

${compellingDescription}

### Technical Details
- **Primary Language**: ${primaryLanguage}
- **Architecture**: Modular design pattern
- **Compatibility**: Cross-platform support
- **Performance**: Optimized for production use
${liveDemoSection}
## Features 🌟

### Core Functionality
- **Primary feature implementation with comprehensive error handling.**
- **Robust secondary feature support, enhancing overall utility.**
- **Advanced configuration options for granular control.**
- **Integrated error handling and data validation mechanisms.**
- **Performance optimization techniques applied throughout the codebase.**

### Advanced Capabilities
- **Extensible plugin system, allowing for custom module integration.**
- **Built-in analytics and logging for operational insights.**
- **Comprehensive security protocols, including authentication and authorization.**
- **Mobile-responsive design, ensuring optimal user experience on all devices.**
- **Internationalization support for global deployment.**

## Installation 📦

### Prerequisites
Before proceeding with the installation, ensure the following software is installed on your system:
- Node.js (version 14.0.0 or higher recommended)
- npm (Node Package Manager, version 6.0.0 or higher)
- Git version control system

### Step-by-Step Installation Process

1. **Clone the Repository**
   Initiate the process by cloning the project repository from GitHub:
   \`\`\`bash
   git clone ${cloneUrl}
   cd ${projectName.toLowerCase()}
   \`\`\`

2. **Dependency Management**
   Install all required project dependencies using npm:
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Project Build**
   \`\`\`bash
   npm run build
   \`\`\`

## Configuration Parameters ⚙️

### Basic Configuration
A typical basic configuration might look like this:
\`\`\`json
{
  "name": "${projectName}",
  "version": "1.0.0",
  "environment": "production"
}
\`\`\`

### Advanced Options
- **Database Configuration**: Detailed parameters for connecting to various database systems.
- **API Endpoint Settings**: Customization options for external API integrations.
- **Security Parameters**: Fine-tuning of authentication, authorization, and encryption settings.
- **Performance Tuning**: Parameters for optimizing application speed and resource usage.

## Usage Examples 💡

### Basic Implementation
A fundamental example demonstrating the core functionality:
\`\`\`javascript
const ${projectName} = require('./${projectName}') // Adjust path as necessary

// Initialize the module with default settings
const instance = new ${projectName}()

// Execute the primary function and log the result
const result = instance.execute()
console.log('Operation Result:', result)
\`\`\`

### Advanced Usage
Illustrative examples for more complex scenarios, including asynchronous operations:
\`\`\`javascript
// Define custom configuration for the instance
const config = {
  option1: 'value1',
  option2: 'value2'
}

const instance = new ${projectName}(config)

// Asynchronous operation example
async function advancedExample() {
  try {
    const processedData = await instance.processAsync()
    console.log('Processed Data:', processedData)
    return processedData
  } catch (error) {
    console.error('An error occurred during advanced processing:', error)
  }
}

advancedExample()
\`\`\`

## Contributing Guidelines 🤝

We highly value community contributions! Please review our comprehensive contributing guidelines before submitting any changes.

### Development Workflow
1. Fork the repository: Create a personal fork of the project.
2. Create a feature branch: Branch off from \`main\` for new features or bug fixes.
3. Implement changes with tests: Ensure all new code is thoroughly tested.
4. Submit a pull request: Provide a detailed description of your changes.

### Code Standards
- Adhere strictly to ESLint and Prettier configurations.
- Maintain comprehensive test coverage for all new and modified features.
- Update relevant documentation to reflect changes.
- Utilize conventional commits for clear commit history.

## Testing Procedures 🧪

### Running Tests
Execute the following commands to run the various test suites:
\`\`\`bash
# Run all unit tests
npm test

# Execute integration tests
npm run test:integration

# Generate a detailed test coverage report
npm run test:coverage
\`\`\`

### Test Structure
- **Unit Tests**: Located in the \`/tests/unit\` directory, focusing on individual functions.
- **Integration Tests**: Found in \`/tests/integration\`, verifying interactions between components.
- **End-to-End Tests**: Reside in \`/tests/e2e\`, simulating full user workflows.

## Troubleshooting 🔧

### Common Issues

**Issue 1: Installation fails with dependency errors**
- **Solution**: Verify your Node.js and npm versions against the prerequisites. Try clearing your npm cache (\`npm cache clean --force\`) and reinstalling dependencies.

**Issue 2: Build errors after cloning**
- **Solution**: Ensure all dependencies are installed (\`npm install\`). Check for missing environment variables.

**Issue 3: Runtime errors during execution**
- **Solution**: Review console logs for specific error messages. Verify environment configuration and data inputs.

### Getting Help
- Consult the project's FAQ section for common questions.
- Search existing issues on the GitHub repository for similar problems.
- If your issue persists, create a new issue with detailed information and steps to reproduce.

## License Information 📄

This project is licensed under the ${originalContent.includes("License") ? originalContent.split("## License")[1]?.split("\n")[1]?.trim() : "MIT License"}. A copy of the license is included in the repository.

---

**Comprehensive documentation maintained by the ${projectName} Development Team**  
**Last Updated**: ${new Date().toLocaleDateString()}  
**Version**: 1.0.0`,
  }

  return vibeRewrites[vibe as keyof typeof vibeRewrites] || vibeRewrites.professional
}
