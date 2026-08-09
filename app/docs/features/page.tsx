import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Features" }

export default function FeaturesPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Core Concepts</p>
        <h1 className="docs-h1">Features</h1>
        <p className="docs-lead">
          Every capability README Garden ships with — documented against the actual implementation.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">README Generation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The core feature. Enter a public GitHub URL, optionally add a live demo URL and a brief project description,
          choose a vibe, and click generate. The server fetches real repo data, builds a context-rich prompt, and
          calls GPT-4o. The whole pipeline takes 5–15 seconds.
        </p>
        <div className="docs-callout docs-callout-tip">
          <p className="text-sm">
            The <strong>Project Purpose</strong> field is the highest-priority context in the prompt — if you fill it in,
            the model will use it over the GitHub description and any scraped metadata.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Six Vibe Presets</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Each vibe is a distinct system-instruction block injected at the top of the prompt. The difference is not
          just tone — structure, emoji usage, section names, and formality level all change.
        </p>
        <div className="space-y-4">
          {[
            {
              vibe: "🎯 Professional",
              value: "professional",
              desc: "Formal corporate language. No emojis. Clean section headers. Technical specifications. Appropriate for enterprise or open-source libraries where maintainers need to project credibility.",
            },
            {
              vibe: "😊 Friendly",
              value: "friendly",
              desc: "Conversational and warm. Uses encouraging language, welcomes contributors, adds personal touches. Ideal for community tools, learning projects, or side projects where you want people to feel welcome.",
            },
            {
              vibe: "😄 Humorous",
              value: "humorous",
              desc: "Jokes, programming puns, and witty analogies mixed with accurate technical information. Makes your README entertaining to read without sacrificing substance.",
            },
            {
              vibe: "🎨 Creative",
              value: "creative",
              desc: "Artistic and expressive. Uses metaphors, storytelling, and creative formatting. Sections may be named unconventionally. Best for design tools, games, or art projects.",
            },
            {
              vibe: "✨ Minimal",
              value: "minimal",
              desc: "Extreme brevity. Only the essential sections: what it is, how to install, how to use, and the license. Virtually no fluff. Great for CLI tools or libraries where developers just want the facts.",
            },
            {
              vibe: "📚 Detailed",
              value: "detailed",
              desc: "Comprehensive and exhaustive. Includes table of contents, in-depth explanations, API reference hints, troubleshooting, and testing instructions. Suited for complex systems requiring thorough documentation.",
            },
          ].map((item) => (
            <div key={item.value} className="rounded-xl border border-border/60 bg-card/30 p-4">
              <h3 className="font-semibold text-foreground mb-1">{item.vibe}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">AI Rewrite</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Clicking <strong className="text-foreground">AI Rewrite</strong> on the output panel sends the current README
          back to <code className="docs-inline-code">POST /api/rewrite-readme</code> with an incrementing
          <code className="docs-inline-code">rewriteCount</code>. The server picks a different prompt from a
          4-variant rotating array for the selected vibe, strips the existing title, and generates a structurally
          distinct document.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          The version number is tracked in the output panel header — e.g.{" "}
          <code className="docs-inline-code">Your README (v3)</code>. Each rewrite costs one usage quota unit.
        </p>
        <div className="docs-callout docs-callout-note">
          <p className="text-sm">
            Rewrite uses <code className="docs-inline-code">temperature: 0.95</code> vs 0.8 for initial generation,
            deliberately increasing randomness to guarantee variety.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Live Preview</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The output panel renders the generated Markdown via{" "}
          <code className="docs-inline-code">react-markdown</code> with two plugins:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>
              <code className="docs-inline-code">remark-gfm</code> — GitHub Flavoured Markdown: tables, strikethrough,
              task lists, and autolinks.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>
              <code className="docs-inline-code">rehype-highlight</code> — syntax highlighting for fenced code blocks
              using highlight.js under the hood.
            </span>
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          The preview pane is scrollable with a max height of 384px{" "}
          (<code className="docs-inline-code">max-h-96</code>). Prose styles are applied via custom CSS classes in{" "}
          <code className="docs-inline-code">globals.css</code>.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Inline Editing</h2>
        <p className="text-sm text-muted-foreground">
          Switching to the <strong className="text-foreground">Markdown</strong> tab reveals a full-height{" "}
          <code className="docs-inline-code">&lt;textarea&gt;</code> with the raw Markdown. Any changes you make are
          stored in React state — the Preview tab will show the updated content when you switch back. Copy and
          Download always use the current state of the textarea, so edits are preserved in exports.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Copy & Download</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>
              <strong className="text-foreground">Copy</strong> — Calls{" "}
              <code className="docs-inline-code">navigator.clipboard.writeText()</code> with the full Markdown string.
              A toast notification confirms success.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>
              <strong className="text-foreground">Download</strong> — Creates a{" "}
              <code className="docs-inline-code">Blob</code> with MIME type{" "}
              <code className="docs-inline-code">text/markdown</code>, creates a temporary anchor with an object URL,
              programmatically clicks it, then revokes the URL. The file is always named{" "}
              <code className="docs-inline-code">README.md</code>.
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Dark / Light Theme</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Theme is managed by <code className="docs-inline-code">next-themes</code> with{" "}
          <code className="docs-inline-code">defaultTheme="dark"</code> and{" "}
          <code className="docs-inline-code">enableSystem={`{false}`}</code> — system preference is intentionally
          ignored. A toggle button in both headers switches between dark and light. The preference is persisted in
          localStorage by next-themes automatically.
        </p>
        <p className="text-sm text-muted-foreground">
          The marketing page always renders on a dark background regardless of theme. The generate page background is
          theme-aware:{" "}
          <code className="docs-inline-code">from-slate-900 via-purple-900 to-slate-900</code> (dark) and{" "}
          <code className="docs-inline-code">from-green-50 via-blue-50 to-purple-50</code> (light).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Internationalisation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The UI supports English and German via a custom{" "}
          <code className="docs-inline-code">LanguageContext</code> in{" "}
          <code className="docs-inline-code">lib/language-context.tsx</code>. The context exposes a{" "}
          <code className="docs-inline-code">t(key)</code> function that looks up string keys in a flat translation
          map. The selected language is persisted to localStorage under{" "}
          <code className="docs-inline-code">preferred-language</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The language switcher dropdown appears in both the landing page header and the generate page header.
          Switching languages immediately re-renders all translated strings with no page reload.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Intro Animation</h2>
        <p className="text-sm text-muted-foreground">
          The root page (<code className="docs-inline-code">/</code>) shows a full-screen intro animation on first
          load via <code className="docs-inline-code">components/intro-animation.tsx</code>. When the animation
          completes it calls <code className="docs-inline-code">onAnimationComplete()</code>, which sets{" "}
          <code className="docs-inline-code">showMarketing = true</code>, fading in the marketing page. The intro
          is managed with <code className="docs-inline-code">AnimatePresence</code> and{" "}
          <code className="docs-inline-code">mode="wait"</code>.
        </p>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/how-it-works", title: "How It Works" }}
        next={{ href: "/docs/authentication", title: "Authentication" }}
      />
    </div>
  )
}
