import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Usage & Quotas" }

export default function UsageAndQuotasPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Guides</p>
        <h1 className="docs-h1">Usage &amp; Quotas</h1>
        <p className="docs-lead">
          How generation counts are tracked, enforced, and reset across the three user tiers.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Three-tier model</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Limit</th>
                <th>Tracked in</th>
                <th>Resets</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Anonymous</strong></td>
                <td>3 total</td>
                <td>localStorage (<code>readme-usage-total-anon-v1</code>)</td>
                <td>Never</td>
              </tr>
              <tr>
                <td><strong>Free (signed in)</strong></td>
                <td>5 total</td>
                <td>localStorage (<code>readme-usage-total-email-device-v1:{`{email}:{deviceId}`}</code>)</td>
                <td>Never</td>
              </tr>
              <tr>
                <td><strong>Pro</strong></td>
                <td>5 per day</td>
                <td>Supabase <code>users</code> table (<code>uses_today</code>)</td>
                <td>Daily (server-side)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Device ID</h2>
        <p className="text-sm text-muted-foreground mb-4">
          On first load, <code className="docs-inline-code">getOrCreateDeviceId()</code> checks localStorage for a
          key named <code className="docs-inline-code">readme-device-id-v1</code>. If absent, it generates a UUID via{" "}
          <code className="docs-inline-code">crypto.randomUUID()</code> (with a{" "}
          <code className="docs-inline-code">Math.random()</code> fallback for environments that don't support the Web
          Crypto API) and persists it. The same device ID is used for the lifetime of that browser profile.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Anonymous quota</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The count lives in <code className="docs-inline-code">localStorage["readme-usage-total-anon-v1"]</code>. It
          is read on mount and incremented after every successful generation or rewrite. The limit is hard-coded as{" "}
          <code className="docs-inline-code">ANON_TOTAL_LIMIT = 3</code> in{" "}
          <code className="docs-inline-code">app/generate/page.tsx</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          When an anonymous user hits the limit and tries to generate, the auth modal is shown automatically to
          encourage sign-up.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Free signed-in quota</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Free accounts track usage per <em>email + device pair</em> in localStorage. The key is:
        </p>
        <div className="docs-code-block mb-4">
          <pre className="docs-code-pre"><code>{`readme-usage-total-email-device-v1:{email}:{deviceId}`}</code></pre>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          The limit is <code className="docs-inline-code">FREE_EMAIL_DEVICE_LIMIT = 5</code>.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          <strong className="text-foreground">Usage merging on login:</strong> When a user signs in, any anonymous uses
          already consumed on that device are merged into the email+device counter (capped at 5). This prevents the
          common pattern of bypassing the anonymous limit by logging in after exhausting the device quota.
        </p>
        <div className="docs-code-block">
          <div className="docs-code-header"><span>Merge logic (app/generate/page.tsx)</span></div>
          <pre className="docs-code-pre"><code>{`const merged = Math.min(
  FREE_EMAIL_DEVICE_LIMIT,           // cap at 5
  prevEmailDevice + anonTotal        // existing + anonymous uses
)
localStorage.setItem(emailDeviceKey, String(merged))`}</code></pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Pro quota</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Pro usage is tracked entirely server-side in the Supabase{" "}
          <code className="docs-inline-code">users</code> table. Two columns matter:
        </p>
        <div className="docs-table-wrapper mb-4">
          <table className="docs-table">
            <thead>
              <tr><th>Column</th><th>Type</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              <tr><td><code>uses_today</code></td><td>integer</td><td>Generations consumed today</td></tr>
              <tr><td><code>daily_usage_limit</code></td><td>integer</td><td>Max uses per day (default: 5)</td></tr>
              <tr><td><code>last_usage_reset</code></td><td>timestamptz</td><td>Timestamp of the last daily reset</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-3">Daily reset</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Both <code className="docs-inline-code">GET /api/usage/status</code> and{" "}
          <code className="docs-inline-code">POST /api/usage/use</code> check whether{" "}
          <code className="docs-inline-code">last_usage_reset</code> matches today's date. If it doesn't, they reset{" "}
          <code className="docs-inline-code">uses_today</code> to <code className="docs-inline-code">0</code> and update{" "}
          <code className="docs-inline-code">last_usage_reset</code> to the start of the current day (UTC midnight
          equivalent via <code className="docs-inline-code">setHours(0, 0, 0, 0)</code>).
        </p>

        <h3 className="text-lg font-semibold text-foreground mb-3">Status check</h3>
        <p className="text-sm text-muted-foreground mb-4">
          On every page load where Pro status is needed,{" "}
          <code className="docs-inline-code">GET /api/usage/status?userId=:id</code> is called. It returns:
        </p>
        <div className="docs-code-block mb-4">
          <div className="docs-code-header"><span>Response</span></div>
          <pre className="docs-code-pre"><code>{`{
  isPro: boolean,
  remainingToday: number,  // only when isPro is true
  dailyLimit: number,
  subscriptionEnd: string  // ISO timestamp
}`}</code></pre>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-3">Consuming a use</h3>
        <p className="text-sm text-muted-foreground">
          After a successful generation, <code className="docs-inline-code">POST /api/usage/use</code> is called with the
          user ID. The route fetches the current row, checks the daily limit, increments{" "}
          <code className="docs-inline-code">uses_today</code>, and returns the new{" "}
          <code className="docs-inline-code">remainingToday</code> value. If{" "}
          <code className="docs-inline-code">uses_today &gt;= daily_usage_limit</code>, it returns HTTP 429.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">UI indicators</h2>
        <p className="text-sm text-muted-foreground mb-4">
          A badge in the generate page header always shows remaining uses. The label adapts to tier:
        </p>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr><th>Tier</th><th>Badge text (full)</th></tr>
            </thead>
            <tbody>
              <tr><td>Pro</td><td><code>{`{remaining}/5 Uses Today`}</code></td></tr>
              <tr><td>Free (signed in)</td><td><code>{`{remaining}/5 Free Uses (email+device)`}</code></td></tr>
              <tr><td>Anonymous</td><td><code>{`{remaining}/3 Free Uses (device)`}</code></td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          On smaller screens (below <code className="docs-inline-code">lg</code> breakpoint) the badge is truncated to
          just <code className="docs-inline-code">{`{remaining}/{limit}`}</code>.
        </p>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/authentication", title: "Authentication" }}
        next={{ href: "/docs/pro-and-payments", title: "Pro & Payments" }}
      />
    </div>
  )
}
