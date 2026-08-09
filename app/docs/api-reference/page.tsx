import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "API Reference" }

function ApiEndpoint({
  method,
  path,
  description,
  request,
  response,
  notes,
}: {
  method: "GET" | "POST"
  path: string
  description: string
  request?: string
  response?: string
  notes?: string
}) {
  const methodColor =
    method === "GET"
      ? "bg-green-500/15 text-green-400 border-green-500/30"
      : "bg-blue-500/15 text-blue-400 border-blue-500/30"

  return (
    <div className="rounded-xl border border-border/60 bg-card/30 overflow-hidden mb-6">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-card/50">
        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${methodColor}`}>{method}</span>
        <code className="text-sm font-mono text-foreground">{path}</code>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground">{description}</p>
        {request && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Request body</p>
            <div className="docs-code-block">
              <pre className="docs-code-pre text-xs"><code>{request}</code></pre>
            </div>
          </div>
        )}
        {response && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Response</p>
            <div className="docs-code-block">
              <pre className="docs-code-pre text-xs"><code>{response}</code></pre>
            </div>
          </div>
        )}
        {notes && (
          <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 border border-border/40">
            {notes}
          </p>
        )}
      </div>
    </div>
  )
}

export default function ApiReferencePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Reference</p>
        <h1 className="docs-h1">API Reference</h1>
        <p className="docs-lead">
          All HTTP endpoints in the application. Every route lives under <code className="docs-inline-code">/api</code>{" "}
          as a Next.js Route Handler.
        </p>
      </div>

      <div className="docs-callout docs-callout-note mb-10">
        <p className="text-sm">
          All endpoints return JSON. Error responses always include an{" "}
          <code className="docs-inline-code">error</code> string. There is no API versioning, all routes are at root
          path.
        </p>
      </div>

      {/* README Generation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">README Generation</h2>

        <ApiEndpoint
          method="POST"
          path="/api/generate-readme"
          description="Generates a full README from a public GitHub repository URL and optional context. Fetches GitHub API data, scrapes the live demo URL, constructs a vibe-specific prompt, and calls GPT-4o. Falls back to a template generator if OpenAI fails."
          request={`{
  repoUrl: string,         // required — public GitHub repo URL
  vibe: string,            // required — one of: professional | friendly |
                           //   humorous | creative | minimal | detailed
  liveDemoUrl?: string,    // optional — scraped for title + meta description
  projectPurpose?: string  // optional — overrides GitHub description in prompt
}`}
          response={`{ readme: string }  // full Markdown content`}
          notes="This endpoint does not check authentication or usage quotas. Quota enforcement is client-side for free tiers. Pro quota is decremented separately via POST /api/usage/use after a successful response."
        />

        <ApiEndpoint
          method="POST"
          path="/api/rewrite-readme"
          description="Rewrites an existing README in the same vibe using a different structural approach. Rotates through 4 prompt variants per vibe based on the rewriteCount value. Called by the AI Rewrite button."
          request={`{
  content: string,         // required — current README Markdown
  vibe: string,            // required — same vibe as original generation
  repoUrl?: string,        // optional — for reference context
  projectPurpose?: string, // optional — for reference context
  rewriteCount: number     // required — determines which prompt variant to use
}`}
          response={`{ rewrittenReadme: string }`}
        />

        <ApiEndpoint
          method="POST"
          path="/api/rewrite-section"
          description="Applies a full-document vibe rewrite to an arbitrary text block. Intended for future section-level editing. Uses GPT-4o with temperature 0.8."
          request={`{
  section: string,  // required — text to rewrite
  vibe: string      // required — target vibe
}`}
          response={`{ rewrittenSection: string }`}
        />
      </section>

      {/* Authentication */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Authentication</h2>

        <ApiEndpoint
          method="POST"
          path="/api/auth/signup"
          description="Server-side sign-up with email validation (syntax + disposable domain check) and Supabase Auth. The UI uses the Supabase JS SDK directly; this route exists as an alternative server path."
          request={`{
  email: string,
  password: string,
  name: string
}`}
          response={`{
  success: true,
  user: { id, email, name },
  emailConfirmationRequired?: boolean,
  message?: string
}`}
          notes="Returns emailConfirmationRequired: true when Supabase requires the user to confirm their email before signing in."
        />

        <ApiEndpoint
          method="POST"
          path="/api/auth/signin"
          description="Server-side sign-in with syntax-only email validation (no disposable check, so existing users are never blocked). The UI uses the Supabase JS SDK directly."
          request={`{
  email: string,
  password: string
}`}
          response={`{
  success: true,
  user: { id, email, name }
}`}
        />

        <ApiEndpoint
          method="POST"
          path="/api/auth/request-otp"
          description="Sends a 6-digit OTP to an existing account's email via Supabase Auth. shouldCreateUser is false, only pre-existing accounts can receive an OTP. Includes a 30-second timeout on the Supabase call."
          request={`{ email: string }`}
          response={`{ success: true, message: string }`}
        />

        <ApiEndpoint
          method="POST"
          path="/api/auth/verify-otp"
          description="Verifies a 6-digit OTP against the Supabase Auth OTP flow. Returns the authenticated user object on success."
          request={`{
  email: string,
  token: string  // 6-digit OTP
}`}
          response={`{
  success: true,
  user: { id, email, name }
}`}
        />
      </section>

      {/* Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Usage</h2>

        <ApiEndpoint
          method="GET"
          path="/api/usage/status"
          description="Returns the Pro status and remaining daily uses for a given user. Also performs a daily reset of uses_today if last_usage_reset is not today."
          request={`Query param: ?userId={string}`}
          response={`// Not Pro:
{ isPro: false, remainingToday: 0 }

// Pro:
{
  isPro: true,
  remainingToday: number,
  dailyLimit: number,
  subscriptionEnd: string  // ISO timestamp
}`}
          notes="Returns isPro: false (not an error) when the user row doesn't exist in the database. Safe to call for any user ID."
        />

        <ApiEndpoint
          method="POST"
          path="/api/usage/use"
          description="Increments uses_today for a Pro user. Called after a successful generation or rewrite on the client side. Returns 429 if the daily limit is already reached."
          request={`{ userId: string }`}
          response={`{
  success: true,
  remainingToday: number
}`}
          notes="Returns 403 if the user is not Pro or their subscription has expired. Returns 429 if uses_today >= daily_usage_limit."
        />
      </section>

      {/* PayPal */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">PayPal</h2>

        <ApiEndpoint
          method="POST"
          path="/api/paypal/create-order"
          description="Creates a $5.00 USD PayPal order with the user ID as custom_id and returns the approval URL for redirect."
          request={`{ userId: string }`}
          response={`{
  orderID: string,
  approvalUrl: string  // PayPal-hosted checkout page URL
}`}
        />

        <ApiEndpoint
          method="POST"
          path="/api/paypal/capture-order"
          description="Fetches the PayPal order to read custom_id (user ID), captures it if not already completed, then upserts the Supabase users row to activate a 30-day Pro subscription."
          request={`{ orderID: string }`}
          response={`{ success: true }`}
          notes="Handles the ALREADY_CAPTURED PayPal error gracefully idempotent on double-call."
        />

        <ApiEndpoint
          method="POST"
          path="/api/paypal/webhook"
          description="Receives PayPal webhook events. Only processes PAYMENT.CAPTURE.COMPLETED. Reads custom_id from the event resource to identify the user and activates Pro. Payload signature verification is not yet implemented."
          request={`PayPal webhook event payload (application/json)`}
          response={`{ received: true }`}
          notes="Always returns 200 with { received: true } to acknowledge receipt, even for unhandled event types."
        />
      </section>

      {/* UPI */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">UPI</h2>

        <ApiEndpoint
          method="POST"
          path="/api/upi/create-order"
          description="Generates a transaction reference and returns UPI payment details. No external API call, the UPI ID is hard-coded in the route. The client uses the returned upiLink to generate a QR code."
          request={`{ userId: string }`}
          response={`{
  upiId: string,
  amount: "399",
  transactionRef: string,    // RG-{timestamp}-{userId[:8]}
  upiLink: string,           // upi://pay?... deep link
  paymentLink: string        // /api/upi/success redirect URL
}`}
        />

        <ApiEndpoint
          method="GET"
          path="/api/upi/success"
          description="Activates a 30-day Pro subscription for the given user and redirects to /pro/success. Called by the Verify Payment button after the user completes a UPI transaction."
          request={`Query params: ?userId=&transactionRef=&amount=`}
          response={`302 redirect to /pro/success?token={transactionRef}&method=upi&amount={amount}`}
          notes="Payment is not cryptographically verified, the endpoint trusts that the user completed the payment. For production use, replace with a proper UPI gateway webhook."
        />
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/pro-and-payments", title: "Pro & Payments" }}
        next={{ href: "/docs/architecture", title: "Architecture" }}
      />
    </div>
  )
}
