import type { Metadata } from "next"
import Link from "next/link"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Troubleshooting" }

function Issue({ title, cause, fix }: { title: string; cause: string; fix: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/30 p-4 mb-4">
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p><span className="text-foreground font-medium">Cause:</span> {cause}</p>
        <p><span className="text-foreground font-medium">Fix:</span> {fix}</p>
      </div>
    </div>
  )
}

export default function TroubleshootingPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Support</p>
        <h1 className="docs-h1">Troubleshooting</h1>
        <p className="docs-lead">
          Common problems and how to resolve them.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Generation issues</h2>

        <Issue
          title='"Generation Failed" toast with no README output'
          cause="The OpenAI API call failed. Most likely causes: missing OPENAI_API_KEY, exhausted quota, or a network timeout."
          fix="Check your server logs (Vercel dashboard → Functions → Logs or terminal output in dev). If the key is missing, add it to .env.local. If the quota is exhausted, check your OpenAI billing. The app should fall back to a template-based generator even on OpenAI failure — if it doesn't, check that lib/llm.ts is throwing a catchable error."
        />

        <Issue
          title="README is generated but has no repo-specific content"
          cause="The GitHub API rate limit was hit (60 req/hour for unauthenticated requests), or the repository is private."
          fix="Private repos are not supported. For rate limits, wait an hour or add a GitHub Personal Access Token to your server fetch calls (not currently implemented in the codebase — would require a GITHUB_TOKEN env var and an Authorization header in the fetch calls inside generate-readme/route.ts)."
        />

        <Issue
          title="Live demo context is ignored in the README"
          cause="The live demo URL fetch failed silently. Common reasons: the URL requires authentication, redirects to a login page, or returns a non-200 status."
          fix="Ensure the live demo URL is publicly accessible without authentication. Test it with curl or your browser in an incognito window. The server logs a warning when the fetch fails but continues without the data."
        />

        <Issue
          title='"Nothing to Rewrite" when clicking AI Rewrite'
          cause="The generatedReadme state is empty — the rewrite button shouldn't appear in this state, but can trigger if state is cleared unexpectedly."
          fix="Generate a README first. If the button is visible but state is empty, this is a UI bug — check the generatedReadme state in generate/page.tsx."
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Authentication issues</h2>

        <Issue
          title="Sign-up succeeds but user cannot sign in"
          cause="Supabase requires email confirmation and the user hasn't clicked the confirmation link."
          fix="Ask the user to check their inbox (and spam folder). In development, you can disable email confirmation in Supabase → Authentication → Providers → Email → Confirm email."
        />

        <Issue
          title='"Failed to send OTP" error'
          cause="SMTP is not configured in Supabase, or the Supabase built-in email rate limit (2 OTPs/hour) has been hit."
          fix="Configure a custom SMTP provider in Supabase → Authentication → SMTP Settings. For development, services like Resend (free tier available) work well. The OTP route has a 30-second timeout — if your SMTP provider is slow, this can also cause the error."
        />

        <Issue
          title='"No account found with this email" when requesting OTP'
          cause="shouldCreateUser: false is set in the OTP request, so Supabase rejects OTP requests for non-existent accounts."
          fix="The user needs to sign up with email/password first, then they can use OTP for future sign-ins. This is intentional — OTP is a sign-in shortcut, not a sign-up path."
        />

        <Issue
          title='"Disposable Email Not Allowed" error on sign-up'
          cause="The email domain is on the disposable/temporary email blocklist in lib/email-validation.ts."
          fix="Use a permanent email address from a non-disposable provider (Gmail, Outlook, ProtonMail, company email, etc.)."
        />

        <Issue
          title="User is signed in but shows 0 remaining uses"
          cause="The Supabase users table doesn't exist, or the SUPABASE_SERVICE_ROLE_KEY is wrong/missing. The /api/usage/status route returns isPro: false on any Supabase error."
          fix="Run the SQL migration from scripts/sql/001_create_users_table.sql. Verify SUPABASE_SERVICE_ROLE_KEY in your environment. Check server logs for the Supabase fetch error message."
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Payment issues</h2>

        <Issue
          title='"Failed to start checkout" when clicking PayPal button'
          cause="PAYPAL_CLIENT_ID or PAYPAL_SECRET is missing or incorrect, or PAYPAL_MODE doesn't match the credentials type."
          fix="Check your .env.local (or Vercel env vars in production). Ensure PAYPAL_MODE=sandbox when using sandbox credentials and PAYPAL_MODE=live for live credentials. Sandbox and live credentials are different keys."
        />

        <Issue
          title="PayPal payment completes but Pro is not activated"
          cause="The /pro/success page's capture call failed, or the custom_id in the PayPal order is missing."
          fix="Check server logs for the capture-order route. The custom_id is the user's Supabase ID — if the user wasn't signed in when they initiated checkout, it will be missing. Ensure the user is authenticated before clicking the PayPal button. The PayPal webhook (POST /api/paypal/webhook) serves as a backup — verify it is configured in your PayPal developer dashboard."
        />

        <Issue
          title="UPI payment verified but Pro is not activated"
          cause="The /api/upi/success route failed to update the Supabase row — likely a missing or wrong SUPABASE_SERVICE_ROLE_KEY."
          fix="Check the SUPABASE_SERVICE_ROLE_KEY environment variable. Also verify the users table exists. Check server logs from the upi/success route."
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Build &amp; development issues</h2>

        <Issue
          title='"Missing Supabase service env" error on startup'
          cause="supabase-server.ts throws at module initialization if NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing."
          fix="Add both variables to .env.local. Note: NEXT_PUBLIC_SUPABASE_URL is used by both the client and server Supabase clients."
        />

        <Issue
          title="App crashes in a preview deployment with Supabase errors"
          cause="The client-side supabase.ts has a mock fallback for missing env vars, but supabase-server.ts does not."
          fix="Server-side routes will crash if Supabase env vars are missing. Either add them to the preview environment, or wrap the supabase-server.ts instantiation in a lazy initialization pattern."
        />

        <Issue
          title="Type errors during build"
          cause="TypeScript strictness catches issues the development server overlooks."
          fix="The next.config.mjs sets typescript.ignoreBuildErrors: true so builds won't fail on type errors. To see errors, run npx tsc --noEmit from the project root."
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Still stuck?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Check the{" "}
          <Link href="https://github.com/Divyamsharma-18/Readme-Garden/issues" className="docs-link" target="_blank" rel="noopener noreferrer">
            GitHub Issues
          </Link>{" "}
          page to see if the problem has been reported. If not, open a new issue with:
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>A description of what you expected vs. what happened.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>The relevant error message from the browser console or server logs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span>Your Node.js and npm versions (<code className="docs-inline-code">node -v && npm -v</code>).</span>
          </li>
        </ul>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/project-structure", title: "Project Structure" }}
        next={{ href: "/docs/contributing", title: "Contributing" }}
      />
    </div>
  )
}
