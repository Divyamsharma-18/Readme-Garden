import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { content, vibe, repoUrl, projectPurpose } = await request.json()

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
      rewrittenReadme = enhancedFallbackRewrite(content, vibe, repoUrl, projectPurpose)
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
      briefTagline = "A powerful solution designed for modern development workflows."
    }
  }

  // Enhance the description with "selling" language for fallback
  let compellingDescription = briefTagline
  if (briefTagline.length > 0) {
    switch (vibe) {
      case "professional":
        compellingDescription = `Unlock enterprise-grade capabilities with this robust solution. ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This cutting-edge platform")}.`
        break
      case "friendly":
        compellingDescription = `Ready to supercharge your workflow? You're in the right place! ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This amazing tool")}.`
        break
      case "humorous":
        compellingDescription = `Tired of wrestling with complicated tools? This project is here to save your sanity! ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This delightfully clever solution")}.`
        break
      case "creative":
        compellingDescription = `Step into a realm where functionality meets artistry. ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This masterfully crafted experience")}.`
        break
      case "minimal":
        compellingDescription = `Simple. Effective. Powerful. ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This streamlined tool")}.`
        break
      case "detailed":
        compellingDescription = `Discover comprehensive functionality designed for professional excellence. ${briefTagline.replace(/^(A|This) (project|tool|solution)/i, "This extensively engineered system")}.`
        break
      default:
        compellingDescription = `Transform your development experience with this innovative solution. ${briefTagline}.`
    }
  } else {
    compellingDescription =
      "This project represents the next evolution in development tools, offering unparalleled functionality and user experience."
  }

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

## Executive Summary

This enterprise-grade solution delivers exceptional performance and reliability for mission-critical applications.

## Technical Specifications

- **Architecture**: Scalable, production-ready infrastructure
- **Performance**: Optimized for high-throughput environments  
- **Security**: Enterprise-level security protocols
- **Compatibility**: Cross-platform deployment support

## Installation Procedures

\`\`\`bash
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}
npm install --production
npm run build
\`\`\`

## Implementation Guidelines

Follow our comprehensive documentation for seamless integration into your existing infrastructure.

## Corporate Standards

All contributions must adhere to established coding standards and undergo rigorous quality assurance processes.

---

© 2024 ${projectName} Development Team. All rights reserved.`,

    friendly: `# Welcome to ${projectName}! 👋

${compellingDescription}

Hey there, developer friend! We're absolutely thrilled you've discovered our project. We've poured our hearts into creating something that we hope will make your coding journey a little brighter! ✨

## What Makes This Special? 🌟

- **User-Friendly**: We've designed everything with you in mind
- **Community-Driven**: Built by developers, for developers
- **Always Improving**: We're constantly adding new features based on your feedback
- **Supportive**: Our community is here to help you succeed

## Getting Started (It's Super Easy!) 🚀

Don't worry if you're new to this - we've got your back every step of the way!

\`\`\`bash
# Let's get you set up in no time!
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}

# Install all the good stuff
npm install

# You're ready to go! 🎉
npm start
\`\`\`

## Need Help? We're Here! 🤗

Our friendly community is always ready to lend a helping hand. Don't hesitate to reach out!

## Want to Contribute? We'd Love That! 💝

Every contribution, big or small, makes our project better. Join our amazing community of contributors!

Made with lots of ❤️ and ☕ by our incredible community`,

    humorous: `# ${projectName} 🎭

*Because life's too short for boring code!*

${compellingDescription}

## What's This Magical Contraption? 🪄

Think of this as your coding sidekick - the Robin to your Batman, the Watson to your Sherlock, the... well, you get the idea!

## Installation (The Ancient Ritual) 🧙‍♂️

\`\`\`bash
# Step 1: Summon the code from the digital realm
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}

# Step 2: Feed the dependency monsters
npm install

# Step 3: Cross your fingers and hope for the best
npm start
\`\`\`

⚠️ **Warning**: Side effects may include increased productivity, spontaneous "aha!" moments, and an irresistible urge to show off your code to everyone.

## Features That'll Knock Your Socks Off 🧦

- **It Actually Works**: Revolutionary, we know
- **User-Friendly**: Even your cat could use it (results may vary)
- **Bug-Free**: *cough* mostly *cough*
- **Fast**: Faster than your last relationship ended

## Contributing (Join the Circus!) 🎪

Got ideas? We love ideas! Got bugs? We... well, we call those "undocumented features."

---

*No developers were harmed in the making of this README. Your mileage may vary. Void where prohibited.*`,

    creative: `# ✨ ${projectName} ✨
*Where Innovation Dances with Imagination*

${compellingDescription}

## 🎨 The Vision Unfolds

In the tapestry of digital creation, this project stands as a beacon of artistic expression merged with technical excellence.

### 🌟 Core Essence
- **🎭 Expressive**: Every line of code tells a story
- **🌈 Vibrant**: Bringing color to the monochrome world of development
- **🚀 Transcendent**: Beyond mere functionality lies true artistry
- **💫 Inspiring**: Igniting creativity in every interaction

## 🎼 Installation Symphony

\`\`\`bash
# 🎵 First Movement: The Awakening
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}

# 🎶 Second Movement: The Preparation
npm install

# 🎺 Finale: The Grand Performance
npm start
\`\`\`

## 🎪 The Creative Process

Watch as your ideas transform into digital masterpieces through the alchemy of code and creativity.

## 🤝 Join Our Creative Collective

Become part of our artistic journey. Together, we paint the future with pixels and possibilities.

---

*"In every line of code lies infinite possibility"* - The ${projectName} Collective`,

    minimal: `# ${projectName}

${compellingDescription}

## Install

\`\`\`bash
git clone ${cloneUrl}
cd ${projectName.toLowerCase()}
npm install
\`\`\`

## Use

\`\`\`bash
npm start
\`\`\`

## Contribute

1. Fork
2. Branch  
3. Code
4. PR

## License

MIT`,

    detailed: `# ${projectName} - Comprehensive Documentation 📚

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [API Reference](#api-reference)
7. [Contributing](#contributing)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [License](#license)

## Overview 🔍

${compellingDescription}

### Technical Architecture
- **Design Pattern**: Modular, scalable architecture
- **Performance**: Optimized for high-throughput scenarios
- **Security**: Enterprise-grade security implementations
- **Compatibility**: Multi-platform support

## Features 🌟

### Core Functionality
- ✅ Primary feature implementation with comprehensive error handling
- ✅ Advanced configuration options for granular control
- ✅ Integrated logging and monitoring capabilities
- ✅ Performance optimization techniques
- ✅ Comprehensive test coverage

### Advanced Capabilities
- 🔧 Extensible plugin architecture
- 📊 Built-in analytics and reporting
- 🔒 Advanced security protocols
- 📱 Responsive design principles
- 🌐 Internationalization support

## Installation 📦

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Git version control system

### Step-by-Step Installation

1. **Repository Cloning**
   \`\`\`bash
   git clone ${cloneUrl}
   cd ${projectName.toLowerCase()}
   \`\`\`

2. **Dependency Management**
   \`\`\`bash
   npm install
   npm audit fix
   \`\`\`

3. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env
   # Configure environment variables as needed
   \`\`\`

4. **Build Process**
   \`\`\`bash
   npm run build
   \`\`\`

## Configuration ⚙️

### Basic Configuration
\`\`\`json
{
  "name": "${projectName}",
  "version": "1.0.0",
  "environment": "production"
}
\`\`\`

### Advanced Options
- Database configuration parameters
- API endpoint customization
- Security protocol settings
- Performance optimization flags

## Usage Examples 💡

### Basic Implementation
\`\`\`javascript
const ${projectName} = require('./${projectName}')

const instance = new ${projectName}({
  option1: 'value1',
  option2: 'value2'
})

const result = instance.execute()
console.log('Result:', result)
\`\`\`

### Advanced Usage
\`\`\`javascript
async function advancedExample() {
  try {
    const result = await instance.processAsync({
      data: inputData,
      options: advancedOptions
    })
    return result
  } catch (error) {
    console.error('Processing error:', error)
  }
}
\`\`\`

## Contributing 🤝

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Implement changes with comprehensive tests
4. Submit a detailed pull request

### Code Quality Standards
- Maintain 100% test coverage
- Follow established coding conventions
- Update documentation for all changes
- Use conventional commit messages

## Testing 🧪

### Test Execution
\`\`\`bash
npm test                    # Unit tests
npm run test:integration    # Integration tests
npm run test:coverage       # Coverage report
\`\`\`

## Troubleshooting 🔧

### Common Issues
- Installation failures: Check Node.js version compatibility
- Build errors: Verify environment configuration
- Runtime issues: Review log files for detailed error information

---

**Comprehensive documentation maintained by the ${projectName} development team**`,
  }

  return vibeRewrites[vibe as keyof typeof vibeRewrites] || vibeRewrites.professional
}
