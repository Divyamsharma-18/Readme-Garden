import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Sparkles, Zap, Code2, Shield, BookOpen, Terminal } from "lucide-react"

export const metadata: Metadata = {
  title: "Introduction",
}

const quickLinks = [
  {
    icon: Zap,
    title: "Quick Start",
    description: "Generate your first README in under 60 seconds.",
    href: "/docs/quick-start",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "How It Works",
    description: "Understand the AI pipeline behind README generation.",
    href: "/docs/how-it-works",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Code2,
    title: "API Reference",
    description: "Full reference for every HTTP endpoint in the app.",
    href: "/docs/api-reference",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Terminal,
    title: "Local Development",
    description: "Clone, configure, and run the project locally.",
    href: "/docs/local-development",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Authentication",
    description: "How email/password and OTP auth flows work.",
    href: "/docs/authentication",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: BookOpen,
    title: "Configuration",
    description: "All environment variables and what they control.",
    href: "/docs/configuration",
    color: "from-amber-500 to-yellow-500",
  },
]

export default function DocsIndexPage() {
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-purple-400 bg-purple-400/10 border border-purple-400/20 rounded-full px-3 py-1 mb-4">
          <Sparkles className="w-3 h-3" />
          Documentation
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          README Garden
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          README Garden is an AI-powered documentation tool that generates beautiful, personality-driven GitHub README files
          in seconds. Paste a GitHub repository URL, pick a vibe, and the AI does the rest — fetching real repo metadata,
          parsing <code className="docs-inline-code">package.json</code>, scraping your live demo, and producing a polished
          Markdown document ready to copy or download.
        </p>
      </div>

      {/* Callout */}
      <div className="docs-callout docs-callout-tip mb-10">
        <p className="text-sm">
          <strong>New to README Garden?</strong> Start with the{" "}
          <Link href="/docs/quick-start" className="docs-link font-medium">
            Quick Start guide
          </Link>{" "}
          — you&apos;ll have a README generated in under a minute.
        </p>
      </div>

      {/* What it is */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">What is README Garden?</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          README Garden is a Next.js 15 web application built for developers who want great documentation without spending
          hours writing it. The tool connects to the GitHub API, reads your repository structure and metadata, optionally
          scrapes your live demo URL for context, then passes everything through a carefully crafted prompt to OpenAI&apos;s
          GPT-4o model.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The output is a full Markdown README that matches your chosen <strong className="text-foreground">vibe</strong> —
          six personality styles that range from a crisp corporate document to a humorous, emoji-filled write-up.
          Not happy with the first result? Hit{" "}
          <strong className="text-foreground">AI Rewrite</strong> for a completely different version.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The generated README renders in a live preview pane, can be edited directly in the Markdown tab, copied to
          clipboard, or downloaded as a <code className="docs-inline-code">.md</code> file.
        </p>
      </section>

      {/* Quick links grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Browse the docs</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative flex items-start gap-4 rounded-xl border border-border/60 bg-card/40 p-4 transition-all duration-200 hover:border-purple-500/40 hover:bg-card/70 hover:shadow-md hover:shadow-purple-500/5"
              >
                <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${link.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 font-medium text-foreground group-hover:text-purple-400 transition-colors">
                    {link.title}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Key features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Key features</h2>
        <ul className="space-y-2 text-muted-foreground">
          {[
            "GitHub API integration — fetches repo metadata, languages, topics, and existing README",
            "package.json analysis — extracts name, description, keywords, scripts, and dependencies",
            "Live demo scraping — reads the page title and meta description of your deployed app",
            "Six vibe presets — Professional, Friendly, Humorous, Creative, Minimal, Detailed",
            "AI Rewrite — generates a structurally different version on each attempt using rotating prompts",
            "Live Markdown preview — rendered with react-markdown, remark-gfm, and rehype-highlight",
            "Inline editing — edit the raw Markdown directly in the output panel",
            "Copy & download — one click to clipboard or a .md file",
            "OTP-based passwordless sign-in — no separate login page needed",
            "Pro tier — $5 / 30 days via PayPal, ₹399 via UPI (QR code generation)",
            "Usage quotas — 3 anonymous device uses, 5 per email+device for free accounts, 5/day for Pro",
            "i18n — English and German UI via a custom React context",
            "Dark / light theme — next-themes with default dark mode",
            "Fully responsive — mobile-first layout throughout",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* Tech stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Technology stack</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Layer</th>
                <th>Technology</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Framework</td><td>Next.js 15 (App Router)</td></tr>
              <tr><td>Language</td><td>TypeScript 5</td></tr>
              <tr><td>Styling</td><td>Tailwind CSS 3 + CSS variables</td></tr>
              <tr><td>UI Components</td><td>shadcn/ui (Radix UI primitives)</td></tr>
              <tr><td>Animations</td><td>Framer Motion</td></tr>
              <tr><td>AI / LLM</td><td>OpenAI GPT-4o via REST</td></tr>
              <tr><td>Auth &amp; Database</td><td>Supabase (Auth + PostgreSQL)</td></tr>
              <tr><td>Payments</td><td>PayPal REST API + UPI deep links</td></tr>
              <tr><td>Markdown</td><td>react-markdown + remark-gfm + rehype-highlight</td></tr>
              <tr><td>Analytics</td><td>Vercel Analytics</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Next steps */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/30 p-5">
        <div>
          <p className="text-sm font-medium text-foreground">Ready to get started?</p>
          <p className="text-sm text-muted-foreground mt-0.5">Follow the Quick Start guide.</p>
        </div>
        <Link
          href="/docs/quick-start"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Quick Start
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
