import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Architecture" }

export default function ArchitecturePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Technical Reference</p>
        <h1 className="docs-h1">Architecture</h1>
        <p className="docs-lead">
          A technical map of the application — request flows, data boundaries, and how the major
          subsystems connect.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">High-level overview</h2>
        <p className="text-sm text-muted-foreground mb-4">
          README Garden is a monolithic Next.js 15 application. There is no separate backend service — the Next.js
          App Router serves both the React frontend and the API layer (Route Handlers) from a single deployment unit.
        </p>
        <div className="rounded-xl border border-border/60 bg-card/30 p-5 font-mono text-xs text-muted-foreground overflow-x-auto">
          <pre>{`Browser
  │
  ├─ React Client Components (app/*, components/*)
  │    ├─ fetch() → Next.js Route Handlers (/api/*)
  │    │    ├─ fetch() → GitHub API (unauthenticated)
  │    │    ├─ fetch() → Live demo URL (HTML scrape)
  │    │    ├─ fetch() → OpenAI API (GPT-4o)
  │    │    └─ @supabase/supabase-js → Supabase (Auth + DB)
  │    └─ @supabase/supabase-js → Supabase Auth (client-side)
  │
  └─ localStorage (device ID, anon quota, free tier quota, language pref)`}</pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Directory structure</h2>
        <div className="docs-code-block">
          <div className="docs-code-header"><span>Project root</span></div>
          <pre className="docs-code-pre text-xs"><code>{`├── app/
│   ├── layout.tsx           # Root layout: fonts, ThemeProvider, LanguageProvider, Toaster
│   ├── page.tsx             # Marketing page + intro animation
│   ├── providers.tsx        # Alternate providers export (not used in layout)
│   ├── globals.css          # CSS variables, Tailwind base, prose styles
│   ├── generate/
│   │   └── page.tsx         # Main README generator (client component)
│   ├── pro/
│   │   ├── page.tsx         # Pricing / payment page
│   │   └── success/
│   │       ├── page.tsx     # Post-payment confirmation (PayPal capture)
│   │       └── loading.tsx  # Suspense loading state
│   └── api/
│       ├── generate-readme/ # POST — main AI generation endpoint
│       ├── rewrite-readme/  # POST — AI rewrite endpoint
│       ├── rewrite-section/ # POST — section rewrite (future use)
│       ├── auth/
│       │   ├── signup/      # POST — server-side sign-up
│       │   ├── signin/      # POST — server-side sign-in
│       │   ├── request-otp/ # POST — send OTP
│       │   └── verify-otp/  # POST — verify OTP
│       ├── usage/
│       │   ├── status/      # GET  — check Pro status + remaining uses
│       │   └── use/         # POST — decrement Pro daily counter
│       ├── paypal/
│       │   ├── create-order/   # POST — create PayPal order
│       │   ├── capture-order/  # POST — capture and activate Pro
│       │   └── webhook/        # POST — PayPal webhook listener
│       └── upi/
│           ├── create-order/   # POST — generate UPI payment details
│           └── success/        # GET  — activate Pro + redirect
│
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, card, input…)
│   ├── auth-modal.tsx       # Sign-in / sign-up modal with OTP flow
│   ├── footer.tsx           # Shared footer
│   ├── intro-animation.tsx  # Full-screen intro on landing page
│   ├── language-switcher.tsx# EN/DE dropdown
│   ├── loading-animation.tsx# Full-screen loading overlay during generation
│   ├── marketing-page.tsx   # Landing page sections
│   ├── theme-provider.tsx   # next-themes wrapper
│   └── user-profile.tsx     # Avatar + dropdown when signed in
│
├── lib/
│   ├── email-validation.ts  # Zod syntax check + disposable domain detection
│   ├── language-context.tsx # i18n context with EN + DE translations
│   ├── llm.ts               # OpenAI chat completions wrapper
│   ├── supabase.ts          # Client-side Supabase client (with mock fallback)
│   ├── supabase-server.ts   # Server-side Supabase client (service role key)
│   ├── user-table.ts        # USER_TABLE constant + schema comment
│   └── utils.ts             # cn() Tailwind class merger
│
├── hooks/
│   └── use-toast.ts         # Toast queue hook (from shadcn/ui)
│
└── scripts/sql/
    └── 001_create_users_table.sql  # Supabase schema migration`}</code></pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Request flow: README generation</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          {[
            { from: "Browser", to: "POST /api/generate-readme", detail: "repoUrl, vibe, liveDemoUrl?, projectPurpose?" },
            { from: "Route Handler", to: "GitHub API", detail: "4 sequential fetch() calls" },
            { from: "Route Handler", to: "Live demo URL", detail: "fetch() HTML → regex extract title + description" },
            { from: "Route Handler", to: "OpenAI GPT-4o", detail: "POST /v1/chat/completions with assembled prompt" },
            { from: "Route Handler", to: "Browser", detail: "{ readme: string }" },
            { from: "Browser (Pro only)", to: "POST /api/usage/use", detail: "{ userId } → decrements uses_today" },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="rounded bg-card/60 border border-border/60 px-2 py-1 font-mono text-foreground">{row.from}</span>
              <span className="text-muted-foreground">→</span>
              <span className="rounded bg-card/60 border border-border/60 px-2 py-1 font-mono text-purple-400">{row.to}</span>
              <span className="text-muted-foreground hidden sm:inline">— {row.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">State management</h2>
        <p className="text-sm text-muted-foreground mb-4">
          There is no global state library (no Redux, Zustand, etc.). State is managed at three levels:
        </p>
        <div className="space-y-3">
          {[
            {
              label: "React component state",
              detail: "All UI state (form inputs, generated README, auth status, Pro flags, modal visibility) lives in useState within the page components. State is not shared across pages — each page re-fetches what it needs.",
            },
            {
              label: "React Context",
              detail: "Two contexts are provided at the root layout level: ThemeProvider (next-themes) for dark/light mode and LanguageProvider (custom) for i18n. Both persist their selection to localStorage.",
            },
            {
              label: "localStorage",
              detail: "Device ID, anonymous quota counter, per-email+device quota counters, and language preference are persisted in localStorage. Keys are versioned (e.g. readme-device-id-v1) to allow future migrations.",
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border/60 bg-card/30 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">External service dependencies</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Usage</th>
                <th>Required for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OpenAI API</td>
                <td>GPT-4o via REST</td>
                <td>AI generation (falls back to templates if unavailable)</td>
              </tr>
              <tr>
                <td>GitHub API</td>
                <td>Unauthenticated REST v3</td>
                <td>Repo metadata, languages, file structure (optional — falls back to defaults)</td>
              </tr>
              <tr>
                <td>Supabase</td>
                <td>Auth + PostgreSQL</td>
                <td>User accounts, Pro subscriptions, daily quotas</td>
              </tr>
              <tr>
                <td>PayPal</td>
                <td>Orders REST API v2</td>
                <td>Credit/debit card payments (sandbox or live)</td>
              </tr>
              <tr>
                <td>Vercel Analytics</td>
                <td>Page view tracking</td>
                <td>Usage analytics (no user data)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Build &amp; deployment</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The project is a standard Next.js app with no custom server. It deploys to Vercel with zero configuration
          changes — environment variables are set in the Vercel dashboard. The{" "}
          <code className="docs-inline-code">next.config.mjs</code> sets three flags:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span><code className="docs-inline-code">eslint.ignoreDuringBuilds: true</code> — ESLint errors do not fail the build.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span><code className="docs-inline-code">typescript.ignoreBuildErrors: true</code> — TypeScript errors do not fail the build.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span><code className="docs-inline-code">images.unoptimized: true</code> — Next.js Image Optimization is disabled.</span>
          </li>
        </ul>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/api-reference", title: "API Reference" }}
        next={{ href: "/docs/configuration", title: "Configuration" }}
      />
    </div>
  )
}
