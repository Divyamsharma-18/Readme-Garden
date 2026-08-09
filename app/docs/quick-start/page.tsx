import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Quick Start" }

export default function QuickStartPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Getting Started</p>
        <h1 className="docs-h1">Quick Start</h1>
        <p className="docs-lead">
          Generate your first AI-powered README in under 60 seconds. No account required.
        </p>
      </div>

      {/* Steps */}
      <section className="mb-12 space-y-8">
        {/* Step 1 */}
        <div className="docs-step">
          <div className="docs-step-number">1</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Open the generator</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Navigate to{" "}
              <Link href="/generate" className="docs-link">
                /generate
              </Link>{" "}
              or click <strong className="text-foreground">Grow My README</strong> on the landing page. You land on a
              two-panel layout: the input form on the left, the output panel on the right.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="docs-step">
          <div className="docs-step-number">2</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Paste your GitHub repository URL</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Enter a public GitHub repository URL. The app immediately parses the owner and repo name from the URL to
              call the GitHub API on the server side.
            </p>
            <div className="docs-code-block">
              <div className="docs-code-header">
                <span>Example</span>
              </div>
              <pre className="docs-code-pre"><code>{`https://github.com/Divyamsharma-18/Readme-Garden`}</code></pre>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              The repository does <strong className="text-foreground">not</strong> need to be yours. Any public repo
              works. Private repos are not supported, as the GitHub API is called without authentication.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="docs-step">
          <div className="docs-step-number">3</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Optionally add context</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Two optional fields improve the output quality:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                <span>
                  <strong className="text-foreground">Live Demo URL</strong>: The server fetches this URL and extracts
                  the page <code className="docs-inline-code">&lt;title&gt;</code> and{" "}
                  <code className="docs-inline-code">meta description</code> to enrich the prompt.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                <span>
                  <strong className="text-foreground">Project Purpose / Description</strong>: A few sentences you write
                  yourself. The prompt treats this as the highest-priority context, overriding the GitHub description
                  when present.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="docs-step">
          <div className="docs-step-number">4</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Choose a vibe</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Select one of six personality presets from the dropdown. Each maps to a completely different set of system
              instructions sent to the model.
            </p>
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Vibe</th>
                    <th>Tone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>🎯 Professional</td><td>Formal, corporate, no emojis</td></tr>
                  <tr><td>😊 Friendly</td><td>Warm, conversational, encouraging</td></tr>
                  <tr><td>😄 Humorous</td><td>Jokes, puns, funny analogies</td></tr>
                  <tr><td>🎨 Creative</td><td>Artistic, expressive, metaphorical</td></tr>
                  <tr><td>✨ Minimal</td><td>Ultra-concise, essentials only</td></tr>
                  <tr><td>📚 Detailed</td><td>Exhaustive, comprehensive, academic</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="docs-step">
          <div className="docs-step-number">5</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Click Generate README</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The button fires a <code className="docs-inline-code">POST /api/generate-readme</code> request. A full-screen
              loading animation plays while the server fetches GitHub data, scrapes the live demo (if provided), and
              calls the OpenAI API. Generation takes 5–15 seconds depending on repository size and API latency.
            </p>
            <div className="docs-callout docs-callout-tip">
              <p className="text-sm">
                If the OpenAI API call fails (network error, rate limit, invalid key), the server automatically falls
                back to a template-based generator that still respects your chosen vibe and incorporates all available
                repo data.
              </p>
            </div>
          </div>
        </div>

        {/* Step 6 */}
        <div className="docs-step">
          <div className="docs-step-number">6</div>
          <div className="docs-step-content">
            <h3 className="docs-step-title">Review, edit, and export</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The output panel has two tabs:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Preview</strong>: Rendered Markdown with syntax-highlighted
                  code blocks, GFM tables, and task lists.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">Markdown</strong>: Raw editable textarea. Changes here update
                  the preview in real time when you switch tabs.
                </span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Three action buttons appear at the top of the output panel:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground mt-2">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                <span><strong className="text-foreground">AI Rewrite</strong>: Generates a completely structurally different version in the same vibe, using rotating prompt variations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                <span><strong className="text-foreground">Copy</strong>: Writes the full Markdown to the clipboard.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                <span><strong className="text-foreground">Download</strong>: Triggers a browser download of <code className="docs-inline-code">README.md</code>.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Usage limits */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Usage limits</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Limit</th>
                <th>Reset</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Anonymous (no account)</td>
                <td>3 total per device</td>
                <td>Never (stored in localStorage)</td>
              </tr>
              <tr>
                <td>Free (signed in)</td>
                <td>5 total per email + device pair</td>
                <td>Never (stored in localStorage)</td>
              </tr>
              <tr>
                <td>Pro</td>
                <td>5 per day</td>
                <td>Daily, tracked server-side in Supabase</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Both Generate and AI Rewrite consume one use each. See{" "}
          <Link href="/docs/usage-and-quotas" className="docs-link">
            Usage &amp; Quotas
          </Link>{" "}
          for the full explanation.
        </p>
      </section>

      <DocsPrevNext
        next={{ href: "/docs/how-it-works", title: "How It Works" }}
      />
    </div>
  )
}
