import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { repoUrl, vibe, liveDemoUrl } = await request.json()

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

    // Generate README based on vibe with VERY different prompts
    const vibePrompts = {
      professional: `Create a PROFESSIONAL, corporate-style README that's clean, formal, and business-oriented. Use:
      - Formal language and corporate terminology
      - Clear section headers with professional structure
      - Technical specifications and requirements
      - Professional badges and shields
      - Formal installation and deployment instructions
      - Corporate contribution guidelines
      - Professional contact information
      - No emojis, keep it strictly business`,

      friendly: `Create a WARM and WELCOMING README that feels like talking to a helpful friend. Use:
      - Conversational, approachable language
      - Encouraging and supportive tone
      - Helpful tips and friendly advice
      - Welcome messages for new contributors
      - Personal touches and community feel
      - Gentle guidance for beginners
      - Warm closing messages
      - Use friendly emojis sparingly (😊, 👋, 🤝)`,

      humorous: `Create a FUN and WITTY README that makes people smile while being informative. Use:
      - Clever jokes and programming puns
      - Funny analogies and metaphors
      - Witty section headers and descriptions
      - Humorous installation instructions
      - Playful warnings and notes
      - Entertaining examples and use cases
      - Funny contributor guidelines
      - Use fun emojis (😄, 🎉, 🚀, 🎯, 🔥)`,

      creative: `Create an ARTISTIC and EXPRESSIVE README that's visually stunning and unique. Use:
      - Creative formatting and visual elements
      - Artistic section dividers and headers
      - Colorful and expressive language
      - Creative metaphors and storytelling
      - Unique project descriptions
      - Artistic installation guides
      - Creative examples and demos
      - Abundant creative emojis (🎨, ✨, 🌟, 🎭, 🎪)`,

      minimal: `Create a CLEAN and SIMPLE README with just the essentials. Use:
      - Concise, direct language
      - Minimal sections (only what's necessary)
      - Short, clear sentences
      - Simple installation steps
      - Basic usage examples
      - Essential information only
      - Clean, uncluttered layout
      - Very few or no emojis`,

      detailed: `Create a COMPREHENSIVE and THOROUGH README with extensive documentation. Use:
      - In-depth explanations and descriptions
      - Detailed installation procedures
      - Comprehensive usage examples
      - Extensive API documentation
      - Detailed troubleshooting guides
      - Complete contribution guidelines
      - Thorough testing instructions
      - Educational emojis (📚, 📖, 🔍, 📋, 📊)`,
    }

    const liveDemoContext = liveDemoUrl
      ? `
    A live demo URL was provided: ${liveDemoUrl}.
    ${liveDemoTitle ? `The live demo page title is: "${liveDemoTitle}".` : ""}
    ${liveDemoMetaDescription ? `The live demo page meta description is: "${liveDemoMetaDescription}".` : ""}
    Use this information to describe what the live demo showcases and integrate it into the README.
    `
      : ""

    const existingReadmeContextPrompt = existingReadmeContent
      ? `
    Existing README.md content from the repository (use this to understand the project's purpose, features, and existing documentation style, but rewrite it completely to match the chosen vibe):
    \`\`\`markdown
    ${existingReadmeContent}
    \`\`\`
    `
      : ""

    const packageJsonContextPrompt =
      Object.keys(packageJsonContent).length > 0
        ? `
    Additional project details from package.json (use these to understand the project's core purpose, technologies, and features):
    - Project Name (from package.json): ${packageJsonContent.name || "N/A"}
    - Version: ${packageJsonContent.version || "N/A"}
    - Description (from package.json): ${packageJsonContent.description || "N/A"}
    - Keywords: ${packageJsonContent.keywords?.join(", ") || "N/A"}
    - Scripts: ${Object.keys(packageJsonContent.scripts || {}).join(", ") || "N/A"}
    - Dependencies: ${Object.keys(packageJsonContent.dependencies || {}).join(", ") || "N/A"}
    - Dev Dependencies: ${Object.keys(packageJsonContent.devDependencies || {}).join(", ") || "N/A"}
    `
        : ""

    const prompt = `
    ${vibePrompts[vibe as keyof typeof vibePrompts]}
    
    Here is all the information gathered about the project. Use ALL of it to understand the project's purpose, features, and what it's about.
    
    GitHub Repository Information:
    - Name: ${repoData.name}
    - Description: ${repoData.description || "No description provided"}
    - Primary Language: ${repoData.language || "Not specified"}
    - All Languages: ${Object.keys(languages).join(", ") || "Not available"}
    - Stars: ${repoData.stargazers_count}
    - Forks: ${repoData.forks_count}
    - Created: ${new Date(repoData.created_at).toLocaleDateString()}
    - Last Updated: ${new Date(repoData.updated_at).toLocaleDateString()}
    - Homepage: ${repoData.homepage || "None"}
    - Topics: ${repoData.topics?.join(", ") || "None"}
    - License: ${repoData.license?.name || "Not specified"}
    
    Project Structure (top-level files/folders):
    ${contents.length > 0 ? contents.map((item: any) => `- ${item.name} (${item.type})`).join("\n") : "- Standard project structure"}
    
    ${existingReadmeContextPrompt}
    ${packageJsonContextPrompt}
    ${liveDemoContext}
    
    Create a UNIQUE README that STRONGLY reflects the ${vibe} vibe. Make it completely different from other vibes.
    
    **CRITICAL INSTRUCTION:** The most important part of this README is the initial "Project title and compelling description" section. You MUST synthesize all the provided information (GitHub repo data, existing README, package.json, and live demo details) to clearly and accurately explain **WHAT THIS PROJECT IS ABOUT**, its core purpose, and its key functionalities. This section should be the USP of the generated README.
    
    Include these sections (adapt style to vibe):
    1. Project title and compelling description (synthesize from ALL available info, focusing on "what it's about")
    2. Key features and highlights (infer from all available info)
    3. Installation/setup instructions
    4. Usage examples and code snippets
    5. Configuration options (if applicable)
    6. Contributing guidelines
    7. License and legal information
    8. Support and contact information
    ${liveDemoUrl ? "9. Live Demo section with the provided URL and a description based on the project's purpose and the scraped live demo content." : ""}
    
    IMPORTANT: Return ONLY the markdown content without code block formatting or any conversational text.
    `

    // Try with OpenAI first, fallback to mock generation if API key is missing
    let text = ""

    try {
      if (process.env.OPENAI_API_KEY) {
        const result = await generateText({
          model: openai("gpt-4o"),
          prompt,
          maxTokens: 2500,
          temperature: 0.8, // Add creativity
        })
        text = result.text
      } else {
        throw new Error("No OpenAI API key")
      }
    } catch (error) {
      console.log("OpenAI generation failed, using fallback:", error)

      // Enhanced fallback README generation with distinct vibes
      text = generateEnhancedFallbackReadme(
        repoData,
        vibe,
        languages,
        liveDemoUrl,
        existingReadmeContent,
        packageJsonContent,
        liveDemoTitle,
        liveDemoMetaDescription,
      )
    }

    return NextResponse.json({ readme: text })
  } catch (error) {
    console.error("Error generating README:", error)
    return NextResponse.json({ error: "Failed to generate README. Please try again." }, { status: 500 })
  }
}

function generateEnhancedFallbackReadme(
  repoData: any,
  vibe: string,
  languages: any,
  liveDemoUrl?: string,
  existingReadmeContent?: string,
  packageJsonContent?: Record<string, any>,
  liveDemoTitle?: string | null,
  liveDemoMetaDescription?: string | null,
) {
  const primaryLanguage = Object.keys(languages)[0] || "JavaScript"

  // Synthesize description from all available sources
  let synthesizedDescription = repoData.description || packageJsonContent?.description || ""
  if (existingReadmeContent) {
    // Take first paragraph or section from existing README
    const existingReadmeFirstParagraph = existingReadmeContent.split("\n\n")[0]?.trim()
    if (existingReadmeFirstParagraph && existingReadmeFirstParagraph.length > 50) {
      synthesizedDescription = existingReadmeFirstParagraph
    }
  }
  if (liveDemoMetaDescription) {
    synthesizedDescription = liveDemoMetaDescription
  } else if (liveDemoTitle) {
    synthesizedDescription = `This project is about "${liveDemoTitle}". ${synthesizedDescription}`
  }

  if (!synthesizedDescription) {
    synthesizedDescription = "A project built with passion and purpose, designed to solve a specific problem."
  }

  const inferredFeatures =
    packageJsonContent?.keywords?.length > 0
      ? `Key features include: ${packageJsonContent.keywords.join(", ")}.`
      : "It offers a range of functionalities to solve common problems."

  const liveDemoSection = liveDemoUrl
    ? `
## Live Demo 🚀

Experience the project live here: [${liveDemoTitle || repoData.name + " Live"}](${liveDemoUrl})
${liveDemoMetaDescription ? `\n> ${liveDemoMetaDescription}` : ""}
`
    : ""

  const vibeTemplates = {
    professional: `# ${repoData.name}

## Executive Summary

${synthesizedDescription} ${inferredFeatures}

## Technical Specifications

- **Primary Technology**: ${primaryLanguage}
- **Repository Status**: Active Development
- **License**: ${repoData.license?.name || "MIT License"}
${liveDemoSection}
## Installation Requirements

\`\`\`bash
git clone https://github.com/user/${repoData.name}.git
cd ${repoData.name}
npm install --production
\`\`\`

## Implementation Guide

\`\`\`${primaryLanguage.toLowerCase()}
const ${repoData.name} = require('./${repoData.name}');

// Initialize the module
const instance = new ${repoData.name}();
const result = instance.execute();
\`\`\`

## Corporate Contribution Guidelines

1. Fork the repository
2. Create feature branch following naming conventions
3. Implement changes with comprehensive testing
4. Submit pull request with detailed documentation
5. Await code review and approval

## Support and Maintenance

For technical support, please contact the development team through official channels.

---

© 2024 ${repoData.name} Development Team. All rights reserved.`,

    friendly: `# Welcome to ${repoData.name}! 👋

Hey there, fellow developer! Thanks for stopping by our little corner of GitHub. 

## What's This All About? 😊

${synthesizedDescription} We hope you'll find it useful! ${inferredFeatures}

We're using ${primaryLanguage} as our main language, and we think you'll really enjoy working with it!
${liveDemoSection}
## Getting Started (Don't Worry, It's Easy!) 🚀

\`\`\`bash
# First, let's get the code
git clone https://github.com/user/${repoData.name}.git
cd ${repoData.name}

# Now install the dependencies (grab a coffee while this runs!)
npm install
\`\`\`

## How to Use It 🤝

\`\`\`${primaryLanguage.toLowerCase()}
// Here's a simple example to get you started
import ${repoData.name} from './${repoData.name}'

// This is the fun part!
const result = ${repoData.name}()
console.log('Look what we made:', result)
\`\`\`

## Want to Help Out? We'd Love That! 💝

We're always excited to welcome new contributors! Here's how you can join our friendly community:

1. Fork this repo (you've got this!)
2. Create your feature branch
3. Make your awesome changes
4. Share it with us via a pull request

Don't be shy - we're here to help if you get stuck! 

## Questions? We're Here for You! 🤗

Feel free to reach out anytime. We love hearing from our users!

Made with ❤️ by our amazing community`,

    humorous: `# ${repoData.name} 🎭

*Because regular code is too mainstream* 😎

## What Does This Thing Do? 🤔

${synthesizedDescription} ${inferredFeatures}

Built with ${primaryLanguage} because we're rebels like that. 🔥
${liveDemoSection}
## Installation (AKA "The Ritual") 🧙‍♂️

\`\`\`bash
# Step 1: Summon the code
git clone https://github.com/user/${repoData.name}.git
cd ${repoData.name}

# Step 2: Feed the dependencies (they're hungry)
npm install
\`\`\`

⚠️ **Warning**: May cause excessive productivity and spontaneous high-fives.

## Usage (The Fun Part!) 🎪

\`\`\`${primaryLanguage.toLowerCase()}
// Behold, the magic happens here!
import ${repoData.name} from './${repoData.name}'

// This line does more than you think
const magic = ${repoData.name}()

// Prepare to be amazed
console.log('🎉 Ta-da!', magic)
\`\`\`

## Contributing (Join the Circus!) 🎪

Want to add your own brand of chaos? We love chaos!

1. Fork it (like a road, but for code)
2. Branch it (like a tree, but digital)
3. Code it (like a boss)
4. Push it (real good)
5. PR it (and we'll probably love it)

## Bugs? What Bugs? 🐛

They're not bugs, they're *undocumented features*. But if you find any "features" that seem too creative, let us know!

---

*Disclaimer: No developers were harmed in the making of this README. Side effects may include uncontrollable coding and dad jokes.*`,

    creative: `# ✨ ${repoData.name} ✨
*Where Code Meets Art*

🎨 **A Digital Masterpiece** 🎨

${synthesizedDescription} ${inferredFeatures}

## 🌟 The Vision

Crafted with ${primaryLanguage}, this project represents the intersection of:
- 💡 Innovation
- 🎯 Purpose  
- 🚀 Excellence
- 🌈 Creativity
${liveDemoSection}
## 🎭 Installation Symphony

\`\`\`bash
# 🎼 First Movement: Acquisition
git clone https://github.com/user/${repoData.name}.git
cd ${repoData.name}

# 🎵 Second Movement: Preparation
npm install
\`\`\`

## 🎪 The Performance

\`\`\`${primaryLanguage.toLowerCase()}
// 🎨 Paint your canvas
import { ${repoData.name} } from './${repoData.name}'

// 🌟 Create magic
const artwork = new ${repoData.name}()
const masterpiece = artwork.create()

// 🎭 Reveal the creation
console.log('🎨 Behold:', masterpiece)
\`\`\`

## 🤝 Join the Creative Collective

Become part of our artistic journey:

🎯 **Fork** → Create your own interpretation  
🌱 **Branch** → Grow your ideas  
🎨 **Create** → Express your vision  
🚀 **Share** → Inspire others  

## 🌈 Connect With Us

We believe in the power of creative collaboration. Reach out and let's create something beautiful together!

---

*"Code is poetry written in logic"* - The ${repoData.name} Collective`,

    minimal: `# ${repoData.name}

${synthesizedDescription}
${liveDemoSection}
## Install

\`\`\`bash
git clone https://github.com/user/${repoData.name}.git
cd ${repoData.name}
npm install
\`\`\`

## Use

\`\`\`${primaryLanguage.toLowerCase()}
import ${repoData.name} from './${repoData.name}'

const result = ${repoData.name}()
\`\`\`

## Contribute

1. Fork
2. Branch
3. Code
4. PR

## License

${repoData.license?.name || "MIT"}`,

    detailed: `# ${repoData.name} - Comprehensive Documentation 📚

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
${liveDemoUrl ? "11. [Live Demo](#live-demo)" : ""}

## Overview 🔍

${synthesizedDescription}

### Technical Details
- **Primary Language**: ${primaryLanguage}
- **Architecture**: Modular design pattern
- **Compatibility**: Cross-platform support
- **Performance**: Optimized for production use
${liveDemoSection}
## Features 🌟

### Core Functionality
- ✅ Primary feature implementation
- ✅ Secondary feature support
- ✅ Advanced configuration options
- ✅ Error handling and validation
- ✅ Performance optimization

### Advanced Features
- 🔧 Extensible plugin system
- 📊 Built-in analytics
- 🔒 Security implementations
- 📱 Mobile-responsive design
- 🌐 Internationalization support

## Installation 📦

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git

### Step-by-Step Installation

1. **Clone the Repository**
   \`\`\`bash
   git clone https://github.com/user/${repoData.name}.git
   cd ${repoData.name}
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Build the Project**
   \`\`\`bash
   npm run build
   \`\`\`

## Configuration ⚙️

### Basic Configuration
\`\`\`json
{
  "name": "${repoData.name}",
  "version": "1.0.0",
  "environment": "production"
}
\`\`\`

### Advanced Options
- Database configuration
- API endpoint settings
- Security parameters
- Performance tuning

## Usage Examples 💡

### Basic Usage
\`\`\`${primaryLanguage.toLowerCase()}
const ${repoData.name} = require('./${repoData.name}')

// Initialize with default settings
const instance = new ${repoData.name}()

// Execute primary function
const result = instance.execute()
console.log('Result:', result)
\`\`\`

### Advanced Usage
\`\`\`${primaryLanguage.toLowerCase()}
// Custom configuration
const config = {
  option1: 'value1',
  option2: 'value2'
}

const instance = new ${repoData.name}(config)

// Async operations
async function advancedExample() {
  try {
    const result = await instance.processAsync()
    return result
  } catch (error) {
    console.error('Error:', error)
  }
}
\`\`\`

## Contributing 🤝

We welcome contributions! Please read our detailed contributing guidelines.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Install development dependencies
4. Make your changes
5. Run tests
6. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Use conventional commits

## Testing 🧪

### Running Tests
\`\`\`bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
\`\`\`

### Test Structure
- Unit tests in \`/tests/unit\`
- Integration tests in \`/tests/integration\`
- End-to-end tests in \`/tests/e2e\`

## Troubleshooting 🔧

### Common Issues

**Issue 1: Installation fails**
- Solution: Check Node.js version compatibility

**Issue 2: Build errors**
- Solution: Clear node_modules and reinstall

**Issue 3: Runtime errors**
- Solution: Verify environment configuration

### Getting Help
- Check the FAQ section
- Search existing issues
- Create a new issue with detailed information

## License 📄

This project is licensed under the ${repoData.license?.name || "MIT License"}.

---

**Maintained by**: The ${repoData.name} Team  
**Last Updated**: ${new Date().toLocaleDateString()}  
**Version**: 1.0.0`,
  }

  return vibeTemplates[vibe as keyof typeof vibeTemplates] || vibeTemplates.professional
}
