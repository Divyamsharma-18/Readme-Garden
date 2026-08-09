import type { Metadata } from "next"
import Link from "next/link"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Local Development" }

export default function LocalDevelopmentPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Technical Reference</p>
        <h1 className="docs-h1">Local Development</h1>
        <p className="docs-lead">
          Get a full local copy of README Garden running from scratch.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Prerequisites</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr><th>Tool</th><th>Version</th><th>Notes</th></tr>
            </thead>
            <tbody>
              <tr><td>Node.js</td><td>18 or later</td><td>LTS recommended</td></tr>
              <tr><td>npm</td><td>9 or later</td><td>Comes with Node.js</td></tr>
              <tr><td>Git</td><td>Any recent</td><td>For cloning</td></tr>
              <tr><td>Supabase project</td><td>—</td><td>Free tier is sufficient</td></tr>
              <tr><td>OpenAI API key</td><td>—</td><td>Required for AI generation; optional for template fallback testing</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Setup steps</h2>
        <div className="space-y-6">

          <div className="docs-step">
            <div className="docs-step-number">1</div>
            <div className="docs-step-content">
              <h3 className="docs-step-title">Clone the repository</h3>
              <div className="docs-code-block">
                <pre className="docs-code-pre"><code>{`git clone https://github.com/Divyamsharma-18/Readme-Garden.git
cd Readme-Garden`}</code></pre>
              </div>
            </div>
          </div>

          <div className="docs-step">
            <div className="docs-step-number">2</div>
            <div className="docs-step-content">
              <h3 className="docs-step-title">Install dependencies</h3>
              <div className="docs-code-block">
                <pre className="docs-code-pre"><code>{`npm install`}</code></pre>
              </div>
            </div>
          </div>

          <div className="docs-step">
            <div className="docs-step-number">3</div>
            <div className="docs-step-content">
              <h3 className="docs-step-title">Create the Supabase database table</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Log in to your Supabase project dashboard, navigate to the SQL editor, and run the migration:
              </p>
              <div className="docs-code-block">
                <div className="docs-code-header"><span>Supabase SQL editor</span></div>
                <pre className="docs-code-pre text-xs"><code>{`create table if not exists public.users (
  id text primary key,
  subscription_status text
    check (subscription_status in ('pro', 'free'))
    default 'free',
  subscription_start timestamptz,
  subscription_end   timestamptz,
  daily_usage_limit  integer default 5,
  uses_today         integer default 0,
  last_usage_reset   timestamptz,
  updated_at         timestamptz default now()
);

create index if not exists users_subscription_end_idx
  on public.users (subscription_end);`}</code></pre>
              </div>
            </div>
          </div>

          <div className="docs-step">
            <div className="docs-step-number">4</div>
            <div className="docs-step-content">
              <h3 className="docs-step-title">Configure environment variables</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create a <code className="docs-inline-code">.env.local</code> file in the project root:
              </p>
              <div className="docs-code-block">
                <div className="docs-code-header"><span>.env.local</span></div>
                <pre className="docs-code-pre text-xs"><code>{`# ── Supabase ───────────────────────────────────────────────
# Get these from: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional: only change if your table is named differently
# SUPABASE_USER_TABLE=users

# ── OpenAI ─────────────────────────────────────────────────
# Get from: platform.openai.com → API keys
OPENAI_API_KEY=sk-proj-...

# ── PayPal (optional — only needed for payment testing) ────
# Get from: developer.paypal.com → My Apps & Credentials
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_MODE=sandbox`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                See the{" "}
                <Link href="/docs/configuration" className="docs-link">
                  Configuration
                </Link>{" "}
                page for a full explanation of every variable.
              </p>
            </div>
          </div>

          <div className="docs-step">
            <div className="docs-step-number">5</div>
            <div className="docs-step-content">
              <h3 className="docs-step-title">Configure Supabase Auth</h3>
              <p className="text-sm text-muted-foreground mb-3">
                In your Supabase dashboard, under <strong>Authentication → Providers → Email</strong>:
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  <span>Enable the Email provider.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  <span>
                    For local development, disable <strong>Confirm email</strong> to skip the email confirmation step.
                    Re-enable it in production.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  <span>
                    Under <strong>Authentication → URL Configuration</strong>, add{" "}
                    <code className="docs-inline-code">http://localhost:3000</code> to the allowed redirect URLs.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  <span>
                    For OTP (passwordless) to work, configure an SMTP provider under{" "}
                    <strong>Authentication → SMTP Settings</strong>. Supabase's built-in email rate limit (2/hour) is
                    very low — use a service like Resend or SendGrid for development.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="docs-step">
            <div className="docs-step-number">6</div>
            <div className="docs-step-content">
              <h3 className="docs-step-title">Start the development server</h3>
              <div className="docs-code-block">
                <pre className="docs-code-pre"><code>{`npm run dev`}</code></pre>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                The app runs at <code className="docs-inline-code">http://localhost:3000</code>. Next.js uses Fast
                Refresh so changes to any file in <code className="docs-inline-code">app/</code> or{" "}
                <code className="docs-inline-code">components/</code> reload instantly without losing state.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Available scripts</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr><th>Script</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td><code>npm run dev</code></td><td>Start Next.js development server with Fast Refresh on port 3000</td></tr>
              <tr><td><code>npm run build</code></td><td>Create a production build in <code>.next/</code></td></tr>
              <tr><td><code>npm run start</code></td><td>Serve the production build locally (requires <code>build</code> first)</td></tr>
              <tr><td><code>npm run lint</code></td><td>Run Next.js ESLint rules across the codebase</td></tr>
            </tbody>
          </table>
        </div>
        <div className="docs-callout docs-callout-note mt-4">
          <p className="text-sm">
            <code className="docs-inline-code">next.config.mjs</code> sets{" "}
            <code className="docs-inline-code">eslint.ignoreDuringBuilds: true</code> and{" "}
            <code className="docs-inline-code">typescript.ignoreBuildErrors: true</code>, so{" "}
            <code className="docs-inline-code">npm run build</code> will not fail on lint or type errors.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Development without OpenAI</h2>
        <p className="text-sm text-muted-foreground mb-4">
          If you don't have an OpenAI key, generation still works — the route handler catches the{" "}
          <code className="docs-inline-code">Missing OPENAI_API_KEY</code> error and falls back to the template
          generator. The fallback README won't be AI-generated but is structurally correct and can be used to
          test the rest of the UI flow (preview, rewrite, copy, download).
        </p>
        <p className="text-sm text-muted-foreground">
          Similarly, leaving PayPal credentials empty won't crash the app — the Pro payment buttons will show an error
          toast when clicked, but all free-tier features remain fully functional.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Testing payments locally</h2>
        <p className="text-sm text-muted-foreground mb-4">
          For PayPal sandbox testing:
        </p>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Create a sandbox app at <code className="docs-inline-code">developer.paypal.com</code>.</li>
          <li>Add the sandbox Client ID and Secret to <code className="docs-inline-code">.env.local</code>.</li>
          <li>Set <code className="docs-inline-code">PAYPAL_MODE=sandbox</code>.</li>
          <li>Use a PayPal sandbox buyer account (auto-created in the developer dashboard) to complete test payments.</li>
          <li>Verify the Supabase <code className="docs-inline-code">users</code> table row is updated after capture.</li>
        </ol>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/configuration", title: "Configuration" }}
        next={{ href: "/docs/project-structure", title: "Project Structure" }}
      />
    </div>
  )
}
