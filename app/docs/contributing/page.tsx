import type { Metadata } from "next"
import Link from "next/link"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Contributing" }

export default function ContributingPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Support</p>
        <h1 className="docs-h1">Contributing</h1>
        <p className="docs-lead">
          How to contribute code, report bugs, or suggest features for README Garden.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Getting started</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Follow the{" "}
          <Link href="/docs/local-development" className="docs-link">
            Local Development
          </Link>{" "}
          guide to get a working copy of the project running on your machine before making changes.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Reporting bugs</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Open an issue on{" "}
          <Link href="https://github.com/Divyamsharma-18/Readme-Garden/issues" className="docs-link" target="_blank" rel="noopener noreferrer">
            GitHub Issues
          </Link>. Include:
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Steps to reproduce the bug.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Expected behavior vs. what actually happened.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Browser, OS, and Node.js version.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Screenshots or console output if relevant.</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Submitting a pull request</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Fork the repository", body: 'Click Fork on the GitHub repository page. Clone your fork: git clone https://github.com/YOUR_USERNAME/Readme-Garden.git' },
            { step: "2", title: "Create a branch", body: "Branch from main with a descriptive name:\n\ngit checkout -b feat/add-spanish-locale\n# or\ngit checkout -b fix/rewrite-button-disabled-state" },
            { step: "3", title: "Make your changes", body: "Follow the existing code style. The project uses TypeScript, Tailwind CSS, and shadcn/ui components. Reuse existing components and utilities (lib/utils.ts cn(), existing UI primitives) rather than introducing new patterns." },
            { step: "4", title: "Test your changes", body: "Run npm run dev and manually verify the affected flows. There is no automated test suite — manual testing is currently the primary verification method." },
            { step: "5", title: "Commit and push", body: 'Use descriptive commit messages:\n\ngit commit -m "feat: add Spanish translation strings"\ngit push origin feat/add-spanish-locale' },
            { step: "6", title: "Open a pull request", body: "Open a PR against the main branch. Describe what changed, why, and how to test it. Link any related issues." },
          ].map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">{step}</div>
                <div className="mt-2 w-px flex-1 bg-border" />
              </div>
              <div className="pb-4">
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Areas open for contribution</h2>
        <div className="space-y-3">
          {[
            {
              title: "New language translations",
              desc: "Add a new language to the translations object in lib/language-context.tsx and add the locale to the LanguageSwitcher component. All string keys are already extracted — just add the translated values.",
            },
            {
              title: "GitHub token support",
              desc: "The GitHub API is called unauthenticated, limiting requests to 60/hour per IP. Adding a GITHUB_TOKEN env var and an Authorization: token header to the fetch calls in generate-readme/route.ts would raise this to 5,000/hour.",
            },
            {
              title: "PayPal webhook signature verification",
              desc: "The current webhook handler (app/api/paypal/webhook/route.ts) does not verify the PayPal-Transmission-Sig header. Implementing this would prevent fraudulent webhook calls.",
            },
            {
              title: "Additional vibe presets",
              desc: "New vibes can be added to both the vibePrompts map in generate-readme/route.ts and the vibeOptions array in generate/page.tsx. Also add rewrite variants in rewrite-readme/route.ts.",
            },
            {
              title: "README history / saved READMEs",
              desc: "The UserProfile component has a 'My READMEs' menu item but no backing implementation. Generated READMEs could be stored in Supabase storage or a new DB table.",
            },
            {
              title: "Section-level editing UI",
              desc: "app/api/rewrite-section/route.ts is fully implemented. A UI that lets users select individual sections to rewrite would make use of this existing endpoint.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border/60 bg-card/30 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Code style</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>TypeScript throughout. Avoid <code className="docs-inline-code">any</code> — use explicit types or <code className="docs-inline-code">unknown</code> with narrowing.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Use <code className="docs-inline-code">cn()</code> from <code className="docs-inline-code">lib/utils.ts</code> for all Tailwind class merging.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Prefer existing shadcn/ui components over custom HTML. Extend with Tailwind utility classes rather than creating new component abstractions.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Client components need <code className="docs-inline-code">"use client"</code> at the top. Server components (Route Handlers, layout.tsx) should not have it.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>All user-facing strings on the generate page should use <code className="docs-inline-code">t("key")</code> from <code className="docs-inline-code">useLanguage()</code> so they are translatable.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Route Handlers should always return a JSON response. Wrap in try/catch and return appropriate HTTP status codes.</span>
          </li>
        </ul>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/troubleshooting", title: "Troubleshooting" }}
      />
    </div>
  )
}
