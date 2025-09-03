import { type NextRequest, NextResponse } from "next/server"
import { generateWithOpenAI } from "@/lib/llm"

export async function POST(request: NextRequest) {
  try {
    const { section, vibe } = await request.json()

    if (!section || !vibe) {
      return NextResponse.json({ error: "Section content and vibe are required" }, { status: 400 })
    }

    const vibePrompts = {
      professional: `Completely rewrite this README in a PROFESSIONAL, corporate style. Make it formal, business-oriented, and technically precise. Use corporate language, formal structure, and professional terminology. Remove any casual language or emojis.`,
      friendly: `Completely rewrite this README in a FRIENDLY, welcoming tone. Make it conversational, warm, and approachable. Use encouraging language, helpful tips, and a community-focused approach. Add friendly emojis where appropriate.`,
      humorous: `Completely rewrite this README with HUMOR and wit. Add jokes, puns, funny analogies, and entertaining commentary while keeping it informative. Make it fun to read with clever wordplay and amusing examples.`,
      creative: `Completely rewrite this README in a CREATIVE, artistic style. Use expressive language, creative metaphors, visual elements, and artistic formatting. Make it visually stunning and uniquely expressive.`,
      minimal: `Completely rewrite this README in a MINIMAL, clean style. Make it concise, direct, and simple. Remove unnecessary words, keep only essential information, and use clean, uncluttered formatting.`,
      detailed: `Completely rewrite this README in a DETAILED, comprehensive style. Add extensive explanations, thorough documentation, in-depth examples, and comprehensive coverage of all aspects. Make it educational and thorough.`,
    } as const

    const prompt = `
${vibePrompts[vibe as keyof typeof vibePrompts]}

Original README:
${section}

IMPORTANT: Completely rewrite this entire README to match the ${vibe} vibe. 
Don't just modify it - create a brand new version that strongly reflects the ${vibe} style.
Keep all the important information but present it in a completely different way.
Return ONLY the rewritten README content without any code block formatting.
`

    let text = ""
    try {
      text = await generateWithOpenAI({ prompt, model: "gpt-4o", maxTokens: 2500, temperature: 0.8 })
    } catch (error) {
      console.log("OpenAI rewrite failed, using enhanced fallback:", error)
      text = enhancedFallbackRewrite(section, vibe)
    }

    return NextResponse.json({ rewrittenSection: text })
  } catch (error) {
    console.error("Error rewriting section:", error)
    return NextResponse.json({ error: "Failed to rewrite section. Please try again." }, { status: 500 })
  }
}

function enhancedFallbackRewrite(originalContent: string, vibe: string) {
  const lines = originalContent.split("\n")
  const title = lines.find((line) => line.startsWith("#")) || "# Project"
  const projectName = title
    .replace(/^#+\s*/, "")
    .replace(/[^\w\s]/g, "")
    .trim()

  const vibeRewrites = {
    professional: `${title}

## Executive Summary

This repository contains a professional software solution designed for enterprise-level implementation.

## Technical Specifications

- **Architecture**: Modern, scalable design
- **Implementation**: Industry-standard practices
- **Compatibility**: Cross-platform support

## Installation Procedures

\`\`\`bash
git clone <repository-url>
cd ${projectName.toLowerCase()}
npm install --production
\`\`\`

## Implementation Guidelines

Please refer to the technical documentation for detailed implementation procedures.

## Corporate Contribution Standards

All contributions must adhere to established coding standards and undergo thorough review processes.

---

© 2024 ${projectName} Development Team`,

    friendly: `# Welcome to ${projectName}! 👋

Hey there! Thanks for checking out our project. We're so excited to have you here! 😊

## What's This All About?

This is a friendly little project that we've built with lots of love and care. We think you're going to really enjoy using it!

## Getting Started (It's Super Easy!) 🚀

\`\`\`bash
# Let's get you set up!
git clone <repository-url>
cd ${projectName.toLowerCase()}
npm install
\`\`\`

Don't worry if you're new to this - we've all been there! 

## How to Use It 🤝

We've made this as simple as possible. Just follow along and you'll be up and running in no time!

## Want to Help Out? 💝

We'd absolutely love your help! Our community is super welcoming and we're always here to support each other.

Feel free to reach out anytime - we're here for you! 🤗

Made with ❤️ by our amazing community`,

    humorous: `# ${projectName} 🎭
*Because boring code is so last century*

## What Does This Thing Actually Do? 🤔

Great question! It does... things. Really cool things. The kind of things that make other repositories jealous.

## Installation (AKA "The Ancient Ritual") 🧙‍♂️

\`\`\`bash
# Step 1: Summon the code from the digital realm
git clone <repository-url>
cd ${projectName.toLowerCase()}

# Step 2: Feed the hungry dependencies
npm install
\`\`\`

⚠️ **Warning**: Side effects may include uncontrollable productivity and spontaneous "aha!" moments.

## Usage (The Fun Part!) 🎪

Using this is easier than explaining why we have so many JavaScript frameworks.

## Contributing (Join Our Circus!) 🎪

Got ideas? We love ideas! Got bugs? We... well, we call those "undocumented features."

---

*No developers were harmed in the making of this README. Results may vary. Void where prohibited.*`,

    creative: `# ✨ ${projectName} ✨
*Where Code Becomes Art*

🎨 **A Digital Canvas** 🎨

This project is where technology and creativity dance together in perfect harmony.

## 🌟 The Vision

Every line of code tells a story. Every function is a brushstroke on the canvas of possibility.

## 🎭 Installation Symphony

\`\`\`bash
# 🎼 First Movement: The Awakening
git clone <repository-url>
cd ${projectName.toLowerCase()}

# 🎵 Second Movement: The Preparation
npm install
\`\`\`

## 🎪 The Performance

Watch as your ideas transform into reality through the magic of code.

## 🤝 Join the Creative Collective

Become part of our artistic journey. Together, we create digital masterpieces.

---

*"In every line of code lies infinite possibility"* - The ${projectName} Collective`,

    minimal: `# ${projectName}

Simple. Efficient. Effective.

## Install

\`\`\`bash
git clone <repository-url>
cd ${projectName.toLowerCase()}
npm install
\`\`\`

## Use

Follow the documentation.

## Contribute

Fork. Code. PR.

## License

MIT`,

    detailed: `# ${projectName} - Complete Documentation 📚

## Comprehensive Overview 🔍

This project provides a full-featured solution with extensive functionality and robust architecture designed for production environments.

### Technical Specifications
- **Architecture**: Modular, scalable design
- **Performance**: Optimized for high-throughput scenarios
- **Security**: Enterprise-grade security implementations
- **Compatibility**: Multi-platform support

## Detailed Installation Guide 📦

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git version control

### Step-by-Step Installation Process

1. **Repository Acquisition**
   \`\`\`bash
   git clone <repository-url>
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
   # Configure environment variables
   \`\`\`

## Comprehensive Usage Guide 💡

### Basic Implementation
Detailed examples and use cases for standard implementation scenarios.

### Advanced Configuration
In-depth configuration options for complex deployment scenarios.

## Contributing Guidelines 🤝

### Development Workflow
1. Fork repository
2. Create feature branch
3. Implement changes with tests
4. Submit comprehensive pull request

### Code Quality Standards
- Comprehensive test coverage
- Documentation updates
- Code review process
- Continuous integration

## Troubleshooting Guide 🔧

### Common Issues and Solutions
Detailed troubleshooting information for frequently encountered problems.

### Support Resources
- Documentation wiki
- Community forums
- Issue tracking system

---

**Comprehensive documentation maintained by the ${projectName} development team**`,
  }

  return vibeRewrites[vibe as keyof typeof vibeRewrites] || vibeRewrites.professional
}
