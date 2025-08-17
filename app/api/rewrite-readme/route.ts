import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { content, vibe, repoUrl, projectPurpose, rewriteCount } = await request.json()

    if (!content || !vibe) {
      return NextResponse.json({ error: "Content and vibe are required" }, { status: 400 })
    }

    // Enhanced prompts that force completely different approaches
    const vibePrompts = {
      professional: [
        `Transform this README into a CORPORATE ENTERPRISE document. Use formal business language, executive summaries, technical specifications, and corporate structure. Make it sound like it was written by a Fortune 500 company's technical documentation team.`,

        `Rewrite this as a TECHNICAL SPECIFICATION document. Focus on architecture, scalability, performance metrics, and enterprise-grade features. Use technical jargon and formal documentation standards.`,

        `Convert this into a BUSINESS PROPOSAL style README. Emphasize ROI, business value, competitive advantages, and professional implementation guidelines. Write as if presenting to stakeholders.`,

        `Create a GOVERNMENT/MILITARY style technical manual. Use precise, formal language with numbered sections, compliance standards, and official documentation formatting.`,
      ],

      friendly: [
        `Rewrite this README as if you're explaining it to a close friend over coffee. Use casual conversation, personal anecdotes, encouraging words, and a warm, welcoming tone throughout.`,

        `Transform this into a COMMUNITY-FOCUSED guide. Emphasize collaboration, mutual support, beginner-friendliness, and building relationships. Make it feel like joining a family.`,

        `Rewrite this as a MENTOR speaking to a student. Use encouraging language, helpful tips, gentle guidance, and supportive explanations that build confidence.`,

        `Convert this into a CHEERFUL TUTORIAL style. Use enthusiastic language, celebrate small wins, provide encouragement, and make everything sound achievable and fun.`,
      ],

      humorous: [
        `Rewrite this README with PROGRAMMING HUMOR and developer jokes. Include puns about coding, funny analogies, witty comments about bugs, and entertaining programming references.`,

        `Transform this into a COMEDY SKETCH about software development. Use absurd comparisons, funny scenarios, self-deprecating humor, and amusing takes on common developer problems.`,

        `Rewrite this as if written by a SARCASTIC DEVELOPER who's seen it all. Use dry humor, witty observations, funny warnings, and amusing commentary on the state of software development.`,

        `Convert this into a PARODY of overly serious technical documentation. Mock corporate speak while being informative, use funny examples, and include amusing "warnings" and "disclaimers".`,
      ],

      creative: [
        `Rewrite this README as a POETIC NARRATIVE. Use metaphors, artistic language, creative formatting, and present the project as a journey or story with beautiful, expressive descriptions.`,

        `Transform this into an ARTISTIC MANIFESTO. Use passionate, expressive language about the beauty of code, the art of programming, and the creative process of building software.`,

        `Rewrite this as a FANTASY ADVENTURE GUIDE. Present features as magical abilities, installation as a quest, and usage as embarking on an epic journey with mystical elements.`,

        `Convert this into a VISUAL ART PIECE with words. Use creative typography descriptions, color metaphors, artistic composition, and present code as a canvas for creativity.`,
      ],

      minimal: [
        `Strip this README down to ABSOLUTE ESSENTIALS. Use bullet points, single sentences, no fluff, just the core facts presented in the most concise way possible.`,

        `Rewrite this in TELEGRAM STYLE. Short, punchy sentences. No unnecessary words. Direct commands. Essential info only. Like sending quick messages.`,

        `Transform this into a QUICK REFERENCE CARD. Just the key points, essential commands, basic usage, and critical information in the most compact format.`,

        `Convert this to MINIMALIST DESIGN principles. Clean lines, white space, essential information only, elegant simplicity, no decorative elements.`,
      ],

      detailed: [
        `Expand this README into a COMPREHENSIVE TECHNICAL MANUAL. Add detailed explanations, extensive examples, troubleshooting guides, advanced configurations, and thorough documentation.`,

        `Rewrite this as an ACADEMIC RESEARCH PAPER style documentation. Include methodology, detailed analysis, comprehensive references, and scholarly explanations of every aspect.`,

        `Transform this into a COMPLETE DEVELOPER HANDBOOK. Cover every possible scenario, edge cases, advanced usage patterns, integration examples, and exhaustive configuration options.`,

        `Convert this into an ENCYCLOPEDIA ENTRY about this project. Provide historical context, detailed technical analysis, comprehensive feature coverage, and extensive cross-references.`,
      ],
    }

    // Get the array of prompts for the selected vibe
    const vibePromptArray = vibePrompts[vibe as keyof typeof vibePrompts]

    // Use rewriteCount to cycle through different prompt styles, or use random if we have more rewrites than prompts
    const promptIndex = rewriteCount ? (rewriteCount - 1) % vibePromptArray.length : 0
    const selectedPrompt = vibePromptArray[promptIndex]

    // Remove the existing title (first line starting with #) to prevent title accumulation
    const preprocessContent = (content: string): string => {
      const lines = content.split("\n")
      // Find the first line that starts with # (the title)
      const titleIndex = lines.findIndex((line) => line.trim().startsWith("#"))

      if (titleIndex !== -1) {
        // Remove the title line and return the rest
        lines.splice(titleIndex, 1)
        return lines.join("\n").trim()
      }

      return content
    }

    // Apply preprocessing before sending to AI
    const contentWithoutTitle = preprocessContent(content)

    let rewrittenReadme = ""

    try {
      if (process.env.OPENAI_API_KEY) {
        const result = await generateText({
          model: openai("gpt-4o"),
          prompt: `
          ${selectedPrompt}
          
          CRITICAL INSTRUCTIONS:
          - COMPLETELY REWRITE the entire README from scratch
          - START with a fresh title using # format
          - DO NOT copy any sentences or phrases from the original
          - Use a COMPLETELY DIFFERENT structure and approach
          - Change the writing style, tone, and presentation dramatically
          - Keep the same factual information but present it in an entirely new way
          - Make it feel like a completely different document written by a different person
          
          Original README content to be completely rewritten (title has been removed, you need to create a new one):
          ${contentWithoutTitle}
          
          ${repoUrl ? `Repository URL for reference: ${repoUrl}` : ""}
          ${projectPurpose ? `Core project purpose: "${projectPurpose}"` : ""}
          
          This is rewrite attempt #${rewriteCount || 1}. Make it COMPLETELY different from any previous version.
          
          Return ONLY the completely rewritten README content in markdown format, without any additional text or code block formatting.
          `,
          maxTokens: 3000,
          temperature: 0.95, // Higher temperature for more creativity and variation
        })
        rewrittenReadme = result.text
      } else {
        throw new Error("No OpenAI API key")
      }
    } catch (error) {
      console.log("OpenAI rewrite failed, using enhanced fallback:", error)

      // Enhanced fallback with multiple variations
      rewrittenReadme = enhancedFallbackRewrite(contentWithoutTitle, vibe, repoUrl, projectPurpose, rewriteCount || 1)
    }

    return NextResponse.json({ rewrittenReadme })
  } catch (error) {
    console.error("Error rewriting README:", error)
    return NextResponse.json({ error: "Failed to rewrite README. Please try again." }, { status: 500 })
  }
}

function enhancedFallbackRewrite(
  originalContent: string,
  vibe: string,
  repoUrl?: string,
  projectPurpose?: string,
  rewriteCount = 1,
) {
  // Extract key information from original content
  const lines = originalContent.split("\n")
  const titleLine = lines.find((line) => line.startsWith("#"))
  const projectName = titleLine
    ? titleLine
        .replace(/^#+\s*/, "")
        .replace(/[^\w\s]/g, "")
        .trim()
    : "Project"

  // Create multiple completely different fallback templates for each vibe
  const fallbackVariations = {
    professional: [
      // Variation 1: Corporate Executive Summary
      `# ${projectName} - Enterprise Solution

## Executive Overview

This enterprise-grade software solution delivers exceptional value through innovative technology and robust architecture.

### Key Business Benefits
- Streamlined operational efficiency
- Reduced implementation costs
- Enhanced scalability and performance
- Enterprise-level security compliance

## Technical Architecture

Our solution employs industry-standard frameworks and best practices to ensure reliability and maintainability.

### System Requirements
- Modern development environment
- Standard deployment infrastructure
- Compatible runtime dependencies

## Implementation Strategy

\`\`\`bash
# Enterprise deployment process
git clone ${repoUrl || "repository-url"}
cd ${projectName.toLowerCase()}
npm install --production
npm run build:production
\`\`\`

## Corporate Support

Our dedicated support team ensures seamless integration and ongoing maintenance for enterprise clients.

---
© ${new Date().getFullYear()} ${projectName} Enterprise Solutions`,

      // Variation 2: Technical Specification
      `# Technical Specification: ${projectName}

## System Overview

Advanced software architecture designed for high-performance computing environments and scalable deployment scenarios.

### Core Components
- **Primary Engine**: High-throughput processing unit
- **Interface Layer**: RESTful API with comprehensive endpoints
- **Data Management**: Optimized storage and retrieval systems
- **Security Module**: Multi-layer authentication and authorization

## Performance Metrics
- Response Time: < 100ms average
- Throughput: 10,000+ requests/second
- Uptime: 99.9% SLA guarantee
- Scalability: Horizontal scaling supported

## Deployment Configuration

\`\`\`bash
# Production deployment sequence
git clone ${repoUrl || "repository-url"}
cd ${projectName.toLowerCase()}
npm ci
npm run test:production
npm run deploy:production
\`\`\`

## Quality Assurance

Comprehensive testing protocols ensure reliability and performance standards are maintained across all deployment environments.`,

      // Variation 3: Business Proposal
      `# ${projectName}: Strategic Technology Investment

## Value Proposition

Transform your organization's capabilities with this cutting-edge solution that delivers measurable ROI and competitive advantages.

### Return on Investment
- 40% reduction in operational overhead
- 60% faster time-to-market
- 25% improvement in team productivity
- Significant cost savings in the first year

## Competitive Advantages
✅ Market-leading performance benchmarks  
✅ Industry-standard security protocols  
✅ Seamless integration capabilities  
✅ Comprehensive support ecosystem  

## Implementation Roadmap

**Phase 1: Setup & Configuration**
\`\`\`bash
git clone ${repoUrl || "repository-url"}
cd ${projectName.toLowerCase()}
npm install
\`\`\`

**Phase 2: Deployment & Testing**
- Staging environment validation
- Performance optimization
- Security audit completion

**Phase 3: Production Launch**
- Go-live execution
- Monitoring implementation
- Success metrics tracking

## Strategic Partnership

Join industry leaders who have already transformed their operations with our proven solution.`,
    ],

    friendly: [
      // Variation 1: Coffee Chat Style
      `# Hey there! Welcome to ${projectName} ☕

## What's This All About?

So glad you stopped by! Let me tell you about this awesome project I've been working on. ${projectPurpose || "It's something I'm really excited about and I think you'll love it too!"}

### Why You'll Love It
- Super easy to get started (seriously, anyone can do it!)
- Built with love and attention to detail
- Amazing community of helpful people
- Constantly getting better with your feedback

## Let's Get You Set Up! 🚀

Don't worry, this is going to be fun and easy:

\`\`\`bash
# First, let's grab the code (this is the exciting part!)
git clone ${repoUrl || "your-awesome-repo"}
cd ${projectName.toLowerCase()}

# Now let's install everything (grab a coffee while this runs!)
npm install

# And... we're ready to go! 🎉
npm start
\`\`\`

## Need Help? I'm Here for You! 🤗

Seriously, don't hesitate to reach out. We're all learning together, and I love helping people get started. Drop me a message anytime!

## Want to Contribute?

That would be amazing! Every little bit helps, and I'd love to have you as part of our growing family.

Made with ❤️ and lots of ☕`,

      // Variation 2: Community Focus
      `# Welcome to the ${projectName} Family! 🏠

## Our Story

This project started as a simple idea shared among friends, and now it's grown into something beautiful that brings people together.

### What Makes Us Special
🌟 **Inclusive Community** - Everyone belongs here  
🤝 **Mutual Support** - We help each other grow  
🎯 **Shared Goals** - Building something amazing together  
💡 **Open Collaboration** - Your ideas matter  

## Join Our Journey

Getting started is like joining a conversation with friends:

\`\`\`bash
# Come on in, the water's fine!
git clone ${repoUrl || "our-community-repo"}
cd ${projectName.toLowerCase()}

# Let's set up your space
npm install

# Welcome to the family!
npm run welcome
\`\`\`

## How We Support Each Other

- **Mentorship Program**: Experienced members guide newcomers
- **Weekly Check-ins**: Share progress and celebrate wins
- **Open Office Hours**: Get help when you need it
- **Community Events**: Fun ways to connect and learn

## Growing Together

Every contribution, no matter how small, makes our community stronger. We can't wait to see what you'll bring to our family!

*"Alone we can do so little; together we can do so much."* - Helen Keller`,

      // Variation 3: Mentor Style
      `# Learning ${projectName} Together 📚

## A Personal Note

Hey there, future developer! I'm so excited you're here. Learning new technology can feel overwhelming, but I promise we'll take this journey step by step, together.

### What You'll Gain
- **Confidence** in your abilities
- **Skills** that will serve you well
- **Friends** in the developer community
- **Experience** with real-world projects

## Your Learning Path

Let's start with the basics and build up your confidence:

**Step 1: Get Comfortable**
\`\`\`bash
# Take your time with this - there's no rush
git clone ${repoUrl || "learning-repo"}
cd ${projectName.toLowerCase()}
\`\`\`

**Step 2: Explore Safely**
\`\`\`bash
# This is your playground - experiment freely!
npm install
npm run explore
\`\`\`

**Step 3: Build Something**
\`\`\`bash
# You've got this! I believe in you
npm run create-something-awesome
\`\`\`

## Remember

- **Mistakes are learning opportunities** - I've made thousands!
- **Questions are welcome** - asking shows you're thinking
- **Progress over perfection** - small steps lead to big achievements
- **You belong here** - every expert was once a beginner

## I'm Here to Help

Think of me as your coding buddy. Whenever you're stuck, confused, or just want to share something cool you've built, I'm here for you.

Keep coding, keep learning, keep growing! 🌱`,
    ],

    humorous: [
      // Variation 1: Developer Comedy
      `# ${projectName} - Because Regular Code is Too Mainstream 😎

## What Does This Thing Actually Do?

Great question! It does... *checks notes*... amazing things! The kind of things that make other repositories jealous and your rubber duck proud.

### Features That'll Blow Your Mind 🤯
- Works on my machine ✅ (and hopefully yours too)
- 99.9% bug-free* (*bugs are actually features in disguise)
- Powered by caffeine and Stack Overflow
- Guaranteed to make you look smart in meetings

## Installation (AKA "The Ancient Ritual") 🧙‍♂️

\`\`\`bash
# Step 1: Summon the code from the digital realm
git clone ${repoUrl || "the-chosen-repo"}
cd ${projectName.toLowerCase()}

# Step 2: Feed the dependency monsters (they're always hungry)
npm install

# Step 3: Cross your fingers, toes, and any other appendages
npm start
\`\`\`

⚠️ **Warning**: Side effects may include uncontrollable productivity, spontaneous "aha!" moments, and an irresistible urge to refactor everything.

## Troubleshooting Guide

**Problem**: It doesn't work  
**Solution**: Have you tried turning it off and on again?

**Problem**: It works on my machine  
**Solution**: Ship your machine

**Problem**: Weird error messages  
**Solution**: That's not a bug, it's a feature with personality

## Contributing (Join the Circus!) 🎪

Want to add your own brand of chaos? We love chaos! Just remember:
- Code like nobody's watching (but they are, and they're judging)
- Comment your code (future you will thank present you)
- Test your changes (or live dangerously, we don't judge)

---
*Disclaimer: No developers were harmed in the making of this README. Results may vary. Void where prohibited. Not responsible for existential crises caused by reading the source code.*`,

      // Variation 2: Sarcastic Developer
      `# ${projectName}: Another "Revolutionary" Project 🙄

## Oh, You Want to Know What This Does?

*Sigh*... Fine. It's yet another project that's going to "change the world" and "disrupt the industry." You know, like the other 47,000 projects on GitHub.

### "Groundbreaking" Features
- It runs (most of the time)
- Has buttons that do things when clicked
- Probably won't delete your hard drive
- Comes with the standard set of bugs we call "personality"

## Installation (Because You Asked For It)

\`\`\`bash
# Oh, you actually want to install this? Brave soul.
git clone ${repoUrl || "another-repo-to-abandon"}
cd ${projectName.toLowerCase()}

# This will take forever, perfect time for a coffee break
npm install

# Moment of truth... *drumroll*
npm start
\`\`\`

## Usage (Good Luck With That)

1. Open the application
2. Click things until something happens
3. When it breaks (not if, when), check the console
4. Google the error message
5. Copy-paste solution from Stack Overflow
6. Pretend you understood what you just did

## "Contributing"

Oh, you want to contribute? How noble. Here's what you need to know:
- The code is "self-documenting" (translation: no comments)
- Tests are for people who don't believe in themselves
- If it compiles, ship it
- When in doubt, add more console.log statements

## Support

Support? What support? This is open source, baby! You get what you pay for.

*Built with questionable decisions and an unhealthy amount of energy drinks.*`,

      // Variation 3: Absurd Analogies
      `# ${projectName}: Like a Swiss Army Knife, But Digital 🔧

## What Is This Magnificent Beast?

Imagine if a calculator and a unicorn had a baby, and that baby was raised by robots who only spoke in binary. That's basically what this project is, but more useful and less likely to eat your homework.

### Why This Exists
- Because the world needed another thing
- Someone dared me to build it
- My cat stepped on the keyboard and accidentally created genius
- It seemed like a good idea at 3 AM

## Getting Started (The Hero's Journey)

\`\`\`bash
# Begin your quest, brave adventurer!
git clone ${repoUrl || "the-legendary-repo"}
cd ${projectName.toLowerCase()}

# Gather your supplies (dependencies)
npm install

# Awaken the sleeping dragon (start the app)
npm run awaken-the-beast
\`\`\`

### What to Expect
- Magic will happen (or errors, probably errors)
- Your computer might become sentient
- You'll question your life choices
- But in a good way!

## Features (The Good, The Bad, The Weird)

🎯 **Precision**: Like a sniper, but for code  
🚀 **Speed**: Faster than a caffeinated cheetah  
🧠 **Intelligence**: Smarter than the average bear  
🎪 **Entertainment**: More fun than a barrel of monkeys  

## Troubleshooting (When Things Go Sideways)

If something breaks:
1. Panic (briefly)
2. Take a deep breath
3. Sacrifice a rubber duck to the coding gods
4. Try again
5. If all else fails, blame it on solar flares

Remember: Every bug is just a feature that hasn't found its purpose yet!

*Crafted with love, caffeine, and a healthy disregard for conventional wisdom.*`,
    ],

    creative: [
      // Variation 1: Poetic Journey
      `# 🌟 ${projectName}: A Digital Odyssey 🌟

## The Genesis of Innovation

In the realm where silicon dreams meet human imagination, ${projectName} emerges as a testament to the artistry of code—a symphony written in the language of logic, painted with the brushstrokes of creativity.

### The Canvas of Possibility
*Where every function is a verse,*  
*Every variable a character in our story,*  
*Every commit a step forward in our dance*  
*Between the possible and the impossible.*

## The Ritual of Beginning

\`\`\`bash
# Like planting seeds in digital soil
git clone ${repoUrl || "the-garden-of-code"}
cd ${projectName.toLowerCase()}

# Nurturing growth with patient care
npm install

# Watching the first bloom of creation
npm run flourish
\`\`\`

### The Elements of Our Creation
🔥 **Fire** - The passion that drives innovation  
💧 **Water** - The flow of seamless user experience  
🌍 **Earth** - The solid foundation of reliable code  
💨 **Air** - The breath of life in every interaction  

## The Journey Unfolds

Each line of code is a brushstroke on the canvas of possibility. Each function, a note in the grand symphony of software. Together, they create something greater than the sum of their parts—a living, breathing digital entity that serves, inspires, and transforms.

### Chapters in Our Story
- **The Awakening**: When ideas first take shape
- **The Struggle**: Debugging as a form of meditation
- **The Breakthrough**: When everything clicks into place
- **The Sharing**: Releasing our creation into the world

## Join the Creative Collective

Become part of our artistic journey. Add your voice to our chorus, your vision to our canvas, your dreams to our shared reality.

*"Code is poetry written in the language of machines, understood by the heart of humanity."*

---
✨ Crafted with intention, nurtured with care, shared with love ✨`,

      // Variation 2: Fantasy Adventure
      `# ⚔️ The ${projectName} Chronicles ⚔️

## The Legend Begins

In the mystical realm of Development, where bugs lurk in shadowy corners and features shine like precious gems, a new adventure awaits. You, brave coder, are about to embark on an epic quest to master the ancient arts of ${projectName}.

### Your Magical Abilities
🗡️ **Code Sword** - Slice through complex problems  
🛡️ **Debug Shield** - Protect against runtime errors  
🔮 **Feature Crystal** - Manifest new capabilities  
📜 **Documentation Scroll** - Share knowledge with fellow adventurers  

## The Summoning Ritual

\`\`\`bash
# Invoke the ancient incantation
git clone ${repoUrl || "the-sacred-repository"}
cd ${projectName.toLowerCase()}
npm install

# Awaken the sleeping code dragon
npm run summon-magic
\`\`\`

### The Guilds You Can Join
- **Warriors of Frontend** - Masters of the visual realm
- **Wizards of Backend** - Keepers of server secrets
- **Druids of DevOps** - Guardians of the deployment forest
- **Bards of Documentation** - Storytellers of code

## Quests and Adventures

**Novice Quests**
- Slay your first bug
- Implement a simple feature
- Write your first test

**Advanced Campaigns**
- Refactor the ancient codebase
- Optimize performance spells
- Lead a team of fellow adventurers

## The Tavern (Community)

After long days of coding battles, adventurers gather in our tavern to share tales, exchange wisdom, and plan future quests. All are welcome—from the newest apprentice to the most seasoned code wizard.

### House Rules
- Share your knowledge freely
- Help fellow adventurers in need
- Celebrate victories, learn from defeats
- Keep the magic alive through collaboration

*May your code compile on the first try, and may your deployments be ever successful!*

🏰 *Built in the great halls of Open Source, blessed by the Code Gods* 🏰`,

      // Variation 3: Artistic Manifesto
      `# 🎨 ${projectName}: A Digital Renaissance 🎨

## The Artist's Vision

We stand at the intersection of art and technology, where creativity meets functionality, where imagination transforms into reality through the medium of code. ${projectName} is not merely software—it is an expression of human creativity in digital form.

### Our Artistic Principles
**Harmony** - Every element works in perfect balance  
**Rhythm** - The flow of user interaction creates music  
**Color** - Each feature adds vibrancy to the whole  
**Texture** - Layers of functionality create depth  
**Movement** - Dynamic responses bring life to static code  

## The Creative Process

\`\`\`bash
# Prepare your digital canvas
git clone ${repoUrl || "the-artists-studio"}
cd ${projectName.toLowerCase()}

# Mix your palette of dependencies
npm install

# Begin the masterpiece
npm run create-art
\`\`\`

### The Gallery of Features
Each feature is a carefully crafted piece in our digital gallery:

🖼️ **The Portrait Series** - User interfaces that capture essence  
🌅 **Landscape Collection** - Broad, sweeping functionality  
🎭 **Abstract Expressions** - Complex algorithms made beautiful  
🏛️ **Classical Architecture** - Timeless, well-structured code  

## The Studio Collective

Join our community of digital artists, where code is our medium and innovation is our muse. Together, we push the boundaries of what's possible when technology meets creativity.

### Exhibitions and Shows
- Monthly feature showcases
- Collaborative art projects
- Experimental code galleries
- Community critique sessions

## The Philosophy

*"In every line of code lies the potential for beauty. In every function, the possibility of elegance. In every project, the opportunity to create something that not only works, but inspires."*

### Our Commitment
We believe that software should not only solve problems but also elevate the human experience. Every pixel, every interaction, every moment of use should feel intentional, beautiful, and meaningful.

---
🎨 *Created by artists who happen to code, for humans who happen to use computers* 🎨`,
    ],

    minimal: [
      // Variation 1: Extreme Minimal
      `# ${projectName}

${projectPurpose || "Essential functionality."}

## Install
\`\`\`
git clone ${repoUrl || "repo"}
npm i
\`\`\`

## Use
\`\`\`
npm start
\`\`\`

## Done.`,

      // Variation 2: Bullet Points
      `# ${projectName}

• ${projectPurpose || "Core functionality"}
• Simple setup
• Works

## Setup
• \`git clone ${repoUrl || "repo"}\`
• \`npm install\`
• \`npm start\`

## Features
• Fast
• Reliable
• Clean

## Support
• Issues: GitHub
• Docs: README
• Help: Community`,

      // Variation 3: Command Style
      `# ${projectName}

Quick. Simple. Done.

\`\`\`bash
git clone ${repoUrl || "repo"}
cd ${projectName.toLowerCase()}
npm i && npm start
\`\`\`

Works.

MIT License.`,
    ],

    detailed: [
      // Variation 1: Academic Style
      `# ${projectName}: Comprehensive Technical Analysis

## Abstract

This document presents a thorough examination of ${projectName}, analyzing its architectural patterns, implementation strategies, and operational characteristics within modern software development paradigms.

## 1. Introduction and Scope

### 1.1 Project Overview
${projectPurpose || "This project represents a significant contribution to the software development ecosystem, providing robust functionality through carefully designed architectural patterns."}

### 1.2 Methodology
Our analysis employs systematic evaluation of code quality, performance metrics, and user experience patterns to provide comprehensive documentation.

### 1.3 Scope of Documentation
This document covers installation procedures, configuration management, usage patterns, API specifications, troubleshooting protocols, and maintenance guidelines.

## 2. System Architecture

### 2.1 Core Components
- **Primary Engine**: Central processing unit handling core functionality
- **Interface Layer**: User interaction management system
- **Data Management**: Storage and retrieval optimization
- **Security Framework**: Authentication and authorization protocols

### 2.2 Design Patterns
The system implements several established design patterns:
- Model-View-Controller (MVC) for separation of concerns
- Observer pattern for event handling
- Factory pattern for object creation
- Singleton pattern for resource management

## 3. Installation and Configuration

### 3.1 Prerequisites
- Node.js (version 16.0.0 or higher)
- npm (version 8.0.0 or higher)
- Git version control system
- Compatible operating system (Windows 10+, macOS 10.15+, Linux Ubuntu 18.04+)

### 3.2 Installation Procedure
\`\`\`bash
# Step 1: Repository acquisition
git clone ${repoUrl || "repository-url"}
cd ${projectName.toLowerCase()}

# Step 2: Dependency resolution
npm install --verbose

# Step 3: Environment configuration
cp .env.example .env
# Edit .env file with appropriate values

# Step 4: Build process
npm run build

# Step 5: Verification
npm test
\`\`\`

### 3.3 Configuration Parameters
Detailed configuration options available in \`config/settings.json\`:
- Database connection strings
- API endpoint configurations
- Security certificate paths
- Logging level specifications
- Performance optimization flags

## 4. Usage Documentation

### 4.1 Basic Operations
Fundamental usage patterns for standard implementations:

\`\`\`javascript
const ${projectName} = require('./${projectName}');

// Initialize with default configuration
const instance = new ${projectName}();

// Execute primary function
const result = instance.execute();
console.log('Operation result:', result);
\`\`\`

### 4.2 Advanced Configuration
Complex usage scenarios with custom parameters:

\`\`\`javascript
// Advanced configuration object
const advancedConfig = {
  performance: {
    caching: true,
    optimization: 'aggressive',
    memoryLimit: '2GB'
  },
  security: {
    encryption: 'AES-256',
    authentication: 'OAuth2',
    authorization: 'RBAC'
  },
  logging: {
    level: 'debug',
    format: 'json',
    destination: 'file'
  }
};

const instance = new ${projectName}(advancedConfig);
\`\`\`

## 5. API Reference

### 5.1 Core Methods
Comprehensive documentation of all available methods:

#### 5.1.1 \`initialize(config)\`
- **Purpose**: System initialization with custom configuration
- **Parameters**: \`config\` (Object) - Configuration parameters
- **Returns**: \`Promise<boolean>\` - Initialization success status
- **Throws**: \`InitializationError\` - When configuration is invalid

#### 5.1.2 \`execute(options)\`
- **Purpose**: Primary execution method
- **Parameters**: \`options\` (Object) - Execution options
- **Returns**: \`Promise<Result>\` - Execution results
- **Throws**: \`ExecutionError\` - When execution fails

## 6. Performance Analysis

### 6.1 Benchmarks
Performance metrics under various load conditions:
- Single user: < 50ms response time
- 100 concurrent users: < 200ms response time
- 1000 concurrent users: < 500ms response time
- Memory usage: 128MB baseline, 512MB under load

### 6.2 Optimization Strategies
- Connection pooling for database operations
- Caching mechanisms for frequently accessed data
- Lazy loading for resource-intensive operations
- Compression for data transmission

## 7. Security Considerations

### 7.1 Authentication Mechanisms
- Multi-factor authentication support
- OAuth 2.0 integration
- JWT token management
- Session security protocols

### 7.2 Data Protection
- End-to-end encryption for sensitive data
- SQL injection prevention
- XSS attack mitigation
- CSRF protection mechanisms

## 8. Troubleshooting Guide

### 8.1 Common Issues
**Issue**: Installation fails with dependency errors
**Diagnosis**: Check Node.js version compatibility
**Resolution**: Update Node.js to supported version

**Issue**: Application crashes on startup
**Diagnosis**: Review configuration file syntax
**Resolution**: Validate JSON configuration format

### 8.2 Diagnostic Tools
- Built-in health check endpoints
- Comprehensive logging system
- Performance monitoring dashboard
- Error tracking and reporting

## 9. Maintenance and Updates

### 9.1 Regular Maintenance Tasks
- Weekly dependency updates
- Monthly security patches
- Quarterly performance reviews
- Annual architecture assessments

### 9.2 Update Procedures
Systematic approach to applying updates:
1. Backup current system state
2. Test updates in staging environment
3. Apply updates during maintenance window
4. Verify system functionality
5. Monitor for issues post-update

## 10. Contributing Guidelines

### 10.1 Development Workflow
- Fork repository and create feature branch
- Implement changes with comprehensive tests
- Submit pull request with detailed description
- Participate in code review process
- Merge after approval and testing

### 10.2 Code Quality Standards
- 100% test coverage requirement
- ESLint configuration compliance
- TypeScript type safety
- Documentation for all public APIs
- Performance impact assessment

---

**Document Version**: 1.0  
**Last Updated**: ${new Date().toLocaleDateString()}  
**Maintained By**: ${projectName} Development Team`,

      // Variation 2: Encyclopedia Entry
      `# ${projectName}: Complete Reference Guide

## Historical Context and Development

${projectName} emerged from the evolving landscape of modern software development, representing a synthesis of established programming paradigms and innovative approaches to common development challenges.

### Etymology and Naming
The project name "${projectName}" reflects its core purpose and functionality, chosen to convey both technical precision and accessibility to developers across various skill levels.

### Development Timeline
- **Conception Phase**: Initial ideation and requirement gathering
- **Design Phase**: Architecture planning and technology selection
- **Implementation Phase**: Core development and feature integration
- **Testing Phase**: Quality assurance and performance optimization
- **Release Phase**: Public availability and community engagement

## Technical Specifications

### System Requirements
**Minimum Requirements:**
- Processor: 1.5 GHz dual-core
- Memory: 4 GB RAM
- Storage: 500 MB available space
- Network: Broadband internet connection

**Recommended Requirements:**
- Processor: 2.5 GHz quad-core
- Memory: 8 GB RAM
- Storage: 2 GB available space
- Network: High-speed broadband connection

### Compatibility Matrix
| Platform | Version | Status |
|----------|---------|--------|
| Windows | 10+ | Fully Supported |
| macOS | 10.15+ | Fully Supported |
| Linux | Ubuntu 18.04+ | Fully Supported |
| Node.js | 16.0+ | Required |
| npm | 8.0+ | Required |

## Installation Methodology

### Standard Installation Process
\`\`\`bash
# Repository acquisition and setup
git clone ${repoUrl || "https://github.com/user/repository.git"}
cd ${projectName.toLowerCase()}

# Dependency management
npm install --production

# Configuration setup
cp config/default.json config/production.json
# Modify production.json as needed

# System verification
npm run verify-installation
\`\`\`

### Advanced Installation Options
For enterprise environments or specialized deployments:

\`\`\`bash
# Docker-based installation
docker pull ${projectName.toLowerCase()}:latest
docker run -d -p 3000:3000 ${projectName.toLowerCase()}

# Kubernetes deployment
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
\`\`\`

## Functional Analysis

### Core Functionality Overview
The system provides comprehensive functionality across multiple domains:

1. **Primary Operations**: Core business logic implementation
2. **Data Management**: Efficient storage and retrieval mechanisms
3. **User Interface**: Intuitive interaction patterns
4. **Integration Capabilities**: Seamless third-party service connectivity
5. **Security Framework**: Robust protection mechanisms

### Feature Categorization
**Essential Features:**
- Basic operational capabilities
- Standard user interactions
- Core data processing
- Fundamental security measures

**Advanced Features:**
- Complex workflow management
- Advanced analytics and reporting
- Customizable user experiences
- Enterprise integration options

**Experimental Features:**
- Cutting-edge functionality
- Beta testing capabilities
- Future-oriented implementations
- Research and development features

## Usage Patterns and Best Practices

### Standard Usage Scenarios
**Scenario 1: Basic Implementation**
\`\`\`javascript
// Simple initialization and usage
const app = require('${projectName.toLowerCase()}');
const instance = app.create();
const result = instance.process();
\`\`\`

**Scenario 2: Advanced Configuration**
\`\`\`javascript
// Complex setup with custom parameters
const app = require('${projectName.toLowerCase()}');
const config = {
  mode: 'production',
  features: ['analytics', 'caching', 'optimization'],
  security: { level: 'high', encryption: true }
};
const instance = app.create(config);
\`\`\`

### Performance Optimization Guidelines
1. **Memory Management**: Implement proper cleanup procedures
2. **Caching Strategies**: Utilize built-in caching mechanisms
3. **Connection Pooling**: Optimize database connections
4. **Resource Loading**: Implement lazy loading where appropriate
5. **Monitoring**: Establish comprehensive performance monitoring

## Integration Ecosystem

### Supported Integrations
- **Database Systems**: PostgreSQL, MySQL, MongoDB, Redis
- **Cloud Platforms**: AWS, Azure, Google Cloud Platform
- **Monitoring Tools**: Prometheus, Grafana, New Relic
- **CI/CD Pipelines**: Jenkins, GitHub Actions, GitLab CI
- **Authentication Services**: Auth0, Okta, Firebase Auth

### API Documentation
Comprehensive REST API with the following endpoints:
- \`GET /api/status\` - System health check
- \`POST /api/process\` - Primary processing endpoint
- \`GET /api/results\` - Retrieve processing results
- \`PUT /api/config\` - Update configuration
- \`DELETE /api/cache\` - Clear system cache

## Quality Assurance and Testing

### Testing Methodology
- **Unit Testing**: Individual component verification
- **Integration Testing**: System interaction validation
- **Performance Testing**: Load and stress testing
- **Security Testing**: Vulnerability assessment
- **User Acceptance Testing**: End-user validation

### Quality Metrics
- Code Coverage: 95%+ requirement
- Performance Benchmarks: Sub-100ms response times
- Security Score: A+ rating on security audits
- User Satisfaction: 4.5+ star rating
- Uptime: 99.9% availability target

## Community and Ecosystem

### Contributor Guidelines
Detailed procedures for community participation:
1. **Code of Conduct**: Respectful and inclusive behavior
2. **Contribution Process**: Fork, develop, test, submit
3. **Review Criteria**: Code quality, testing, documentation
4. **Recognition System**: Contributor acknowledgment
5. **Mentorship Program**: Support for new contributors

### Support Channels
- **Documentation**: Comprehensive guides and tutorials
- **Community Forum**: Peer-to-peer assistance
- **Issue Tracking**: Bug reports and feature requests
- **Professional Support**: Enterprise-level assistance
- **Training Programs**: Educational resources and workshops

---

**Reference Guide Version**: 2.0  
**Comprehensive Review Date**: ${new Date().toLocaleDateString()}  
**Editorial Board**: ${projectName} Documentation Committee  
**Next Review Scheduled**: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    ],
  }

  // Get the variations for the selected vibe
  const variations = fallbackVariations[vibe as keyof typeof fallbackVariations] || fallbackVariations.professional

  // Use rewriteCount to cycle through variations
  const variationIndex = (rewriteCount - 1) % variations.length

  return variations[variationIndex]
}
