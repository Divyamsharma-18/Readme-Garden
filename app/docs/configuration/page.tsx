import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Configuration" }

function EnvVar({
  name,
  required,
  description,
  example,
  usedIn,
}: {
  name: string
  required: boolean
  description: string
  example?: string
  usedIn: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/30 p-4 mb-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <code className="text-sm font-mono text-purple-400 font-semibold">{name}</code>
        <span
          className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${
            required
              ? "bg-red-500/10 text-red-400 border-red-500/30"
              : "bg-muted/50 text-muted-foreground border-border/40"
          }`}
        >
          {required ? "Required" : "Optional"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      {example && (
        <div className="docs-code-block mb-2">
          <pre className="docs-code-pre text-xs"><code>{example}</code></pre>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        <span className="text-foreground font-medium">Used in:</span> {usedIn}
      </p>
    </div>
  )
}

export default function ConfigurationPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Technical Reference</p>
        <h1 className="docs-h1">Configuration</h1>
        <p className="docs-lead">
          All environment variables the application reads, what they control, and where they are used.
        </p>
      </div>

      <div className="docs-callout docs-callout-tip mb-10">
        <p className="text-sm">
          Copy <code className="docs-inline-code">.env.local.example</code> (if present) or create a{" "}
          <code className="docs-inline-code">.env.local</code> file in the project root. Next.js automatically loads
          it during development. In production, set these in your Vercel (or host) environment variable dashboard.
        </p>
      </div>

      {/* Supabase */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Supabase</h2>

        <EnvVar
          name="NEXT_PUBLIC_SUPABASE_URL"
          required={true}
          description="The base URL of your Supabase project. Found in your Supabase dashboard under Settings → API → Project URL. Prefixed with NEXT_PUBLIC_ so it is available to the browser client."
          example="NEXT_PUBLIC_SUPABASE_URL=https://xyzxyzxyz.supabase.co"
          usedIn="lib/supabase.ts (client), lib/supabase-server.ts (server), app/api/auth/* routes"
        />

        <EnvVar
          name="NEXT_PUBLIC_SUPABASE_ANON_KEY"
          required={true}
          description="The anon (public) API key for your Supabase project. This key has row-level-security (RLS) enforced and is safe to expose in the browser. Found under Settings → API → Project API keys."
          example="NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          usedIn="lib/supabase.ts (client), app/api/auth/* routes"
        />

        <EnvVar
          name="SUPABASE_SERVICE_ROLE_KEY"
          required={true}
          description="The service role (admin) key for your Supabase project. Bypasses Row Level Security — never expose this to the browser. Used only in server-side Route Handlers to write subscription data after payments."
          example="SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          usedIn="lib/supabase-server.ts, app/api/usage/*, app/api/paypal/*, app/api/upi/*"
        />

        <EnvVar
          name="SUPABASE_USER_TABLE"
          required={false}
          description="The name of the table used to store user subscription and usage data. Defaults to 'users' if not set. Change this if your Supabase project uses a different table name (e.g. 'profiles')."
          example="SUPABASE_USER_TABLE=users"
          usedIn="lib/user-table.ts → consumed by all usage and payment routes"
        />
      </section>

      {/* OpenAI */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">OpenAI</h2>

        <EnvVar
          name="OPENAI_API_KEY"
          required={true}
          description="Your OpenAI API key. Used server-side only to call the GPT-4o model for README generation and rewriting. If this key is missing or invalid, generation falls back to the template-based generator."
          example="OPENAI_API_KEY=sk-proj-..."
          usedIn="lib/llm.ts → consumed by app/api/generate-readme, app/api/rewrite-readme, app/api/rewrite-section"
        />
      </section>

      {/* PayPal */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">PayPal</h2>

        <EnvVar
          name="PAYPAL_CLIENT_ID"
          required={false}
          description="Your PayPal REST app Client ID. Required only if you want the PayPal payment flow to work. Obtain from developer.paypal.com → My Apps & Credentials."
          example="PAYPAL_CLIENT_ID=AaBbCcDdEe..."
          usedIn="app/api/paypal/create-order, app/api/paypal/capture-order"
        />

        <EnvVar
          name="PAYPAL_SECRET"
          required={false}
          description="Your PayPal REST app Secret Key. Server-side only. Never expose in the browser."
          example="PAYPAL_SECRET=EeFfGgHh..."
          usedIn="app/api/paypal/create-order, app/api/paypal/capture-order"
        />

        <EnvVar
          name="PAYPAL_MODE"
          required={false}
          description="Controls which PayPal API base URL is used. Set to 'sandbox' for testing with PayPal sandbox accounts, or 'live' for real payments. Defaults to 'sandbox' if not set."
          example="PAYPAL_MODE=sandbox  # or: live"
          usedIn="app/api/paypal/* routes"
        />
      </section>

      {/* Schema */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Database schema</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Run the following SQL in your Supabase SQL editor to create the required table. The script is also available
          at <code className="docs-inline-code">scripts/sql/001_create_users_table.sql</code>.
        </p>
        <div className="docs-code-block">
          <div className="docs-code-header"><span>scripts/sql/001_create_users_table.sql</span></div>
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

-- Index used by the subscription expiry check
create index if not exists users_subscription_end_idx
  on public.users (subscription_end);`}</code></pre>
        </div>
        <div className="docs-callout docs-callout-note mt-4">
          <p className="text-sm">
            The <code className="docs-inline-code">id</code> column stores the Supabase Auth user UUID as text. If
            your project uses a different ID type, adjust the column type accordingly.
          </p>
        </div>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/architecture", title: "Architecture" }}
        next={{ href: "/docs/local-development", title: "Local Development" }}
      />
    </div>
  )
}
