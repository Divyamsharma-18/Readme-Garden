import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "How It Works" }

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Core Concepts</p>
        <h1 className="docs-h1">How It Works</h1>
        <p className="docs-lead">
          From URL input to finished README — a walkthrough of the complete generation pipeline.
        </p>
      </div>

      {/* Pipeline overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">The generation pipeline</h2>

        <div className="space-y-6">
          {[
            {
              step: "1",
              title: "URL parsing",
              color: "bg-purple-500",
              body: (
                <p className="text-sm text-muted-foreground">
                  The server splits the GitHub URL on <code className="docs-inline-code">/</code> after stripping{" "}
                  <code className="docs-inline-code">https://github.com/</code> to extract{" "}
                  <code className="docs-inline-code">owner</code> and <code className="docs-inline-code">repo</code>.
                  Invalid URLs are rejected with a 400 response before any external calls are made.
                </p>
              ),
            },
            {
              step: "2",
              title: "GitHub API fetch (parallel)",
              color: "bg-indigo-500",
              body: (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Four sequential GitHub API calls gather repository context. All calls are wrapped in a single{" "}
                    <code className="docs-inline-code">try/catch</code> so a private repo or API rate-limit gracefully
                    falls back to sensible defaults rather than erroring.
                  </p>
                  <div className="docs-table-wrapper">
                    <table className="docs-table text-xs">
                      <thead>
                        <tr><th>Endpoint</th><th>Data extracted</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><code>GET /repos/:owner/:repo</code></td>
                          <td>name, description, language, stars, forks, homepage, topics, license, timestamps</td>
                        </tr>
                        <tr>
                          <td><code>GET /repos/:owner/:repo/contents</code></td>
                          <td>top-level file/folder list for structure context</td>
                        </tr>
                        <tr>
                          <td><code>GET /repos/:owner/:repo/languages</code></td>
                          <td>language byte counts used to list all languages</td>
                        </tr>
                        <tr>
                          <td><code>GET readme.md download_url</code></td>
                          <td>raw existing README text (included in prompt for style reference)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    If a <code className="docs-inline-code">package.json</code> exists in the root, it is also fetched and
                    parsed to extract name, version, description, keywords, scripts, dependencies, and devDependencies.
                  </p>
                </>
              ),
            },
            {
              step: "3",
              title: "Live demo scraping",
              color: "bg-blue-500",
              body: (
                <p className="text-sm text-muted-foreground">
                  When a live demo URL is provided, the server fetches the raw HTML and extracts two values with regex:
                  the <code className="docs-inline-code">&lt;title&gt;</code> tag content and the{" "}
                  <code className="docs-inline-code">{`meta[name="description"]`}</code> content attribute. These are
                  injected into the prompt as additional context. If the fetch fails (network error, non-200 status),
                  scraping is silently skipped.
                </p>
              ),
            },
            {
              step: "4",
              title: "Prompt construction",
              color: "bg-cyan-500",
              body: (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    A single large prompt is assembled server-side with these sections in priority order:
                  </p>
                  <ol className="space-y-1 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Vibe system instruction (see <code className="docs-inline-code">vibePrompts</code> map in the route)</li>
                    <li>Repository metadata (all GitHub API fields)</li>
                    <li>Project structure (top-level file list)</li>
                    <li>Existing README content (if present)</li>
                    <li>package.json context (if present)</li>
                    <li>Live demo context with scraped title + description</li>
                    <li>User-supplied project purpose (highest priority override)</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-3">
                    The prompt instructs the model to return <em>only</em> the Markdown content with no code fences or
                    conversational wrapper text.
                  </p>
                </>
              ),
            },
            {
              step: "5",
              title: "OpenAI GPT-4o call",
              color: "bg-green-500",
              body: (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    The assembled prompt is sent to{" "}
                    <code className="docs-inline-code">generateWithOpenAI()</code> in{" "}
                    <code className="docs-inline-code">lib/llm.ts</code>:
                  </p>
                  <div className="docs-code-block">
                    <div className="docs-code-header"><span>lib/llm.ts — parameters</span></div>
                    <pre className="docs-code-pre"><code>{`model: "gpt-4o"
maxTokens: 2500
temperature: 0.8`}</code></pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    The function calls the OpenAI chat completions endpoint directly via <code className="docs-inline-code">fetch</code>{" "}
                    (no SDK). The response is read from{" "}
                    <code className="docs-inline-code">choices[0].message.content</code>.
                  </p>
                </>
              ),
            },
            {
              step: "6",
              title: "Fallback generator",
              color: "bg-orange-500",
              body: (
                <p className="text-sm text-muted-foreground">
                  If the OpenAI call throws for any reason, <code className="docs-inline-code">generateEnhancedFallbackReadme()</code>{" "}
                  assembles a README from six vibe-specific Markdown templates, substituting real values from the repo
                  data. The fallback is not AI-generated but still produces a usable, correctly formatted README.
                </p>
              ),
            },
            {
              step: "7",
              title: "Response and render",
              color: "bg-pink-500",
              body: (
                <p className="text-sm text-muted-foreground">
                  The server returns <code className="docs-inline-code">{`{ readme: string }`}</code>. The client stores
                  the string in React state, records one usage count (client-side for free tiers, server-side via{" "}
                  <code className="docs-inline-code">POST /api/usage/use</code> for Pro), then renders the result through{" "}
                  <code className="docs-inline-code">react-markdown</code> with GFM and syntax highlighting.
                </p>
              ),
            },
          ].map(({ step, title, color, body }) => (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${color} text-white text-sm font-bold`}>
                  {step}
                </div>
                <div className="mt-2 w-px flex-1 bg-border" />
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                {body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Rewrite */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">AI Rewrite pipeline</h2>
        <p className="text-muted-foreground text-sm mb-4">
          When you click <strong className="text-foreground">AI Rewrite</strong>, the client sends the current README
          content plus vibe, repo URL, project purpose, and a <code className="docs-inline-code">rewriteCount</code>{" "}
          integer to <code className="docs-inline-code">POST /api/rewrite-readme</code>.
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          The server selects a prompt from a rotating array of 4 vibe-specific rewrite instructions using{" "}
          <code className="docs-inline-code">(rewriteCount - 1) % 4</code>. Each prompt in the array is fundamentally
          different — for example, the <strong className="text-foreground">Professional</strong> vibe cycles through:
          corporate enterprise document → technical specification → business proposal → government-style manual.
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          The title line is stripped from the original content before the prompt so the model always creates a fresh one.
          GPT-4o is called at <code className="docs-inline-code">temperature: 0.95</code> and{" "}
          <code className="docs-inline-code">maxTokens: 3000</code> to maximise variety.
        </p>
        <div className="docs-callout docs-callout-note">
          <p className="text-sm">
            AI Rewrite consumes one usage quota slot, exactly the same as a fresh generation.
          </p>
        </div>
      </section>

      {/* Section rewrite */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Section rewrite</h2>
        <p className="text-muted-foreground text-sm">
          A second endpoint, <code className="docs-inline-code">POST /api/rewrite-section</code>, accepts a single{" "}
          <code className="docs-inline-code">section</code> string and <code className="docs-inline-code">vibe</code>.
          It applies a full-document rewrite to whatever text is passed, at the same model settings. This endpoint was
          added for future granular section-editing functionality in the UI.
        </p>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/quick-start", title: "Quick Start" }}
        next={{ href: "/docs/features", title: "Features" }}
      />
    </div>
  )
}
