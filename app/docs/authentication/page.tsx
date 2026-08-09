import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Authentication" }

export default function AuthenticationPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Guides</p>
        <h1 className="docs-h1">Authentication</h1>
        <p className="docs-lead">
          README Garden uses Supabase Auth with two sign-in methods: email/password and email OTP.
          No OAuth providers are configured.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Overview</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Authentication is entirely optional — the app works for anonymous users up to the device usage limit.
          Signing up unlocks the free tier (5 total uses per email + device pair) and is required before purchasing
          a Pro subscription.
        </p>
        <p className="text-sm text-muted-foreground">
          The Supabase client is initialised in <code className="docs-inline-code">lib/supabase.ts</code> (client-side)
          and <code className="docs-inline-code">lib/supabase-server.ts</code> (server-side). If the environment
          variables are missing, the client-side module falls back to a safe mock object that returns null sessions,
          preventing crashes in preview deployments.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Sign up (email + password)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The sign-up flow runs entirely client-side via the Supabase JS SDK:
        </p>
        <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside mb-4">
          <li>
            Email is validated with <code className="docs-inline-code">isDisposableEmail()</code> from{" "}
            <code className="docs-inline-code">lib/email-validation.ts</code>. Disposable / temporary domain addresses
            are rejected at this step before any network call.
          </li>
          <li>
            <code className="docs-inline-code">supabase.auth.signUp()</code> is called with email, password, and{" "}
            <code className="docs-inline-code">full_name</code> in user metadata.
          </li>
          <li>
            If Supabase requires email confirmation (the default), the user is told to check their inbox. The session
            is not set until the confirmation link is clicked.
          </li>
          <li>
            If email confirmation is disabled in your Supabase project, the user is signed in immediately and the
            onSuccess callback is fired.
          </li>
        </ol>
        <div className="docs-callout docs-callout-note">
          <p className="text-sm">
            The <code className="docs-inline-code">POST /api/auth/signup</code> route exists as an alternative
            server-side path and performs the same email validation. The client-side path in{" "}
            <code className="docs-inline-code">components/auth-modal.tsx</code> is what the UI actually uses.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Sign in (email + password)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The sign-in tab in the auth modal calls{" "}
          <code className="docs-inline-code">supabase.auth.signInWithPassword()</code> directly. Error messages are
          normalised to user-friendly strings — Supabase's raw error messages (which can be verbose or expose internal
          detail) are mapped to clean descriptions like "Invalid email or password".
        </p>
        <p className="text-sm text-muted-foreground">
          On success, the <code className="docs-inline-code">onSuccess</code> callback receives the user ID, email, and
          display name, which are stored in component state to drive the header user profile dropdown.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">OTP sign-in (passwordless)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Accessible via <strong className="text-foreground">Forgot Password?</strong> in the sign-in tab. This is a
          full passwordless sign-in path, not just a password reset:
        </p>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">1</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Request OTP</p>
              <p className="text-sm text-muted-foreground">
                User enters their email. The client calls{" "}
                <code className="docs-inline-code">supabase.auth.signInWithOtp()</code> with{" "}
                <code className="docs-inline-code">shouldCreateUser: false</code> — only existing accounts can use OTP.
                Supabase sends a 6-digit code to the email address.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">2</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Enter OTP</p>
              <p className="text-sm text-muted-foreground">
                A 6-character input appears. The input is filtered to digits only (non-digit key presses are stripped
                client-side). The Verify button is disabled until exactly 6 digits are entered.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-500 text-white text-xs font-bold">3</div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Verify</p>
              <p className="text-sm text-muted-foreground">
                <code className="docs-inline-code">supabase.auth.verifyOtp()</code> is called with{" "}
                <code className="docs-inline-code">type: "email"</code>. On success the user is signed in. A server-side
                equivalent lives at <code className="docs-inline-code">POST /api/auth/verify-otp</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Session management</h2>
        <p className="text-sm text-muted-foreground mb-4">
          On every page load that needs auth state, the component calls{" "}
          <code className="docs-inline-code">supabase.auth.getSession()</code> inside a{" "}
          <code className="docs-inline-code">useEffect</code>. It also subscribes to{" "}
          <code className="docs-inline-code">supabase.auth.onAuthStateChange()</code> to react to sign-in / sign-out
          events from other tabs.
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Sign-out calls <code className="docs-inline-code">supabase.auth.signOut()</code>, clears all local state, and
          shows a toast. The Pro status flags are also reset so the UI correctly reflects the anonymous state.
        </p>
        <div className="docs-callout docs-callout-warning">
          <p className="text-sm">
            Supabase session tokens are stored by the Supabase SDK in localStorage (default). There is no
            server-side session cookie for the Next.js layer — all auth state is client-managed.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Email validation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          <code className="docs-inline-code">lib/email-validation.ts</code> runs a three-step pipeline on signup:
        </p>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Trim and lowercase the raw input.</li>
          <li>Validate syntax with a Zod <code className="docs-inline-code">z.string().email()</code> schema.</li>
          <li>
            Check the domain against two blocklists: the{" "}
            <code className="docs-inline-code">disposable-email-domains-js</code> package (thousands of known
            disposable providers) plus a supplemental hand-curated blocklist in the same file. Subdomain traversal
            is implemented — <code className="docs-inline-code">sub.mailinator.com</code> is caught even if only{" "}
            <code className="docs-inline-code">mailinator.com</code> is in the blocklist.
          </li>
        </ol>
        <p className="text-sm text-muted-foreground mt-3">
          The disposable check is <em>skipped</em> on sign-in so existing users with now-blocked domains are never
          locked out of their accounts.
        </p>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/features", title: "Features" }}
        next={{ href: "/docs/usage-and-quotas", title: "Usage & Quotas" }}
      />
    </div>
  )
}
