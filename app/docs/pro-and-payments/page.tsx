import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Pro & Payments" }

export default function ProAndPaymentsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Guides</p>
        <h1 className="docs-h1">Pro &amp; Payments</h1>
        <p className="docs-lead">
          README Garden Pro costs $5 (or ₹399) for 30 days of access. Two payment methods are supported:
          PayPal and UPI.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Pro benefits</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span><strong className="text-foreground">5 generations per day</strong> — resets every calendar day, tracked server-side.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span><strong className="text-foreground">30-day subscription window</strong> — after 30 days from purchase the subscription expires and the account reverts to the free tier.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
            <span><strong className="text-foreground">Server-side quota enforcement</strong> — unlike free tiers, Pro limits cannot be bypassed by clearing localStorage.</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">PayPal flow</h2>
        <p className="text-sm text-muted-foreground mb-4">
          PayPal uses the REST Orders API. The flow requires{" "}
          <code className="docs-inline-code">PAYPAL_CLIENT_ID</code>,{" "}
          <code className="docs-inline-code">PAYPAL_SECRET</code>, and{" "}
          <code className="docs-inline-code">PAYPAL_MODE</code> (
          <code className="docs-inline-code">sandbox</code> or <code className="docs-inline-code">live</code>).
        </p>

        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Create order",
              body: "The client sends the authenticated user's ID to POST /api/paypal/create-order. The server fetches a PayPal access token, then creates a $5.00 USD order with the user ID embedded as custom_id inside the purchase unit. The response includes an approvalUrl.",
              code: `POST /api/paypal/create-order
Body: { userId: string }

Response: {
  orderID: string,
  approvalUrl: string  // PayPal checkout URL
}`,
            },
            {
              step: "2",
              title: "PayPal checkout",
              body: "The app opens the approvalUrl in a new tab. The user completes payment on PayPal's hosted page. PayPal redirects to /pro/success?token={orderID} on completion or /pro/cancel on cancellation.",
            },
            {
              step: "3",
              title: "Capture order",
              body: "The /pro/success page extracts the token query parameter and calls POST /api/paypal/capture-order. The server fetches the order details to read the custom_id (user ID), captures the payment if not already completed, then upserts the Supabase users row to set subscription_status = 'pro' and a 30-day subscription_end.",
              code: `POST /api/paypal/capture-order
Body: { orderID: string }

Supabase upsert:
{
  id: userId,
  subscription_status: "pro",
  subscription_start: now,
  subscription_end: now + 30 days,
  daily_usage_limit: 5,
  uses_today: 0
}`,
            },
            {
              step: "4",
              title: "Webhook (optional)",
              body: "POST /api/paypal/webhook listens for PAYMENT.CAPTURE.COMPLETED events as a backup for cases where the redirect doesn't fire. It reads custom_id from the event payload and performs the same Supabase upsert. Signature verification is noted as a TODO for production hardening.",
            },
          ].map(({ step, title, body, code }) => (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-white text-xs font-bold">{step}</div>
                <div className="mt-2 w-px flex-1 bg-border" />
              </div>
              <div className="pb-4">
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{body}</p>
                {code && (
                  <div className="docs-code-block">
                    <pre className="docs-code-pre"><code>{code}</code></pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">UPI flow</h2>
        <p className="text-sm text-muted-foreground mb-4">
          UPI support is implemented as a manual QR-code flow, not through a payment gateway. The UPI ID is
          hard-coded in <code className="docs-inline-code">app/api/upi/create-order/route.ts</code>.
        </p>

        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Create order",
              body: "POST /api/upi/create-order generates a transaction reference in the format RG-{timestamp}-{userId prefix} and returns the UPI ID, amount (₹399), and the ref. No external API call is made at this stage.",
              code: `POST /api/upi/create-order
Body: { userId: string }

Response: {
  upiId: string,
  amount: "399",
  transactionRef: string,
  upiLink: string,   // deep link for UPI apps
  paymentLink: string
}`,
            },
            {
              step: "2",
              title: "QR code display",
              body: "The client generates a QR code from the UPI deep link string using the qrcode npm package (client-side canvas rendering via QRCode.toDataURL()). The modal shows the QR image, the UPI ID for manual entry, the amount, and the transaction reference.",
              code: `upi://pay?pa={upiId}&pn=ReadmeGarden&am={amount}&tn=Pro30Days&tr={transactionRef}`,
            },
            {
              step: "3",
              title: "Verify payment",
              body: "After completing the UPI payment in their app, the user clicks Verify Payment. The client calls GET /api/upi/success with userId, transactionRef, and amount. This route updates the Supabase users row to set subscription_status = 'pro' and subscription_end = now + 30 days, then redirects to /pro/success.",
            },
          ].map(({ step, title, body, code }) => (
            <div key={step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">{step}</div>
                <div className="mt-2 w-px flex-1 bg-border" />
              </div>
              <div className="pb-4">
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{body}</p>
                {code && (
                  <div className="docs-code-block">
                    <pre className="docs-code-pre"><code>{code}</code></pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="docs-callout docs-callout-warning mt-4">
          <p className="text-sm">
            The current UPI verify endpoint does not cryptographically verify the payment — it trusts that the user
            completed it. For a production deployment, integrate a proper UPI payment gateway (Razorpay, PhonePe
            Business, etc.) that provides server-side webhook confirmation.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription data model</h2>
        <p className="text-sm text-muted-foreground mb-3">
          When a payment is confirmed, the server upserts the{" "}
          <code className="docs-inline-code">users</code> table row:
        </p>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr><th>Column</th><th>Value set on upgrade</th></tr>
            </thead>
            <tbody>
              <tr><td><code>subscription_status</code></td><td><code>"pro"</code></td></tr>
              <tr><td><code>subscription_start</code></td><td>Current timestamp</td></tr>
              <tr><td><code>subscription_end</code></td><td>Current timestamp + 30 days</td></tr>
              <tr><td><code>daily_usage_limit</code></td><td><code>5</code></td></tr>
              <tr><td><code>uses_today</code></td><td><code>0</code> (reset on upgrade)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          A user is considered Pro only if <code className="docs-inline-code">subscription_status === "pro"</code>{" "}
          AND <code className="docs-inline-code">new Date() &lt; new Date(subscription_end)</code>. Expiry is
          checked on every <code className="docs-inline-code">GET /api/usage/status</code> call.
        </p>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/usage-and-quotas", title: "Usage & Quotas" }}
        next={{ href: "/docs/api-reference", title: "API Reference" }}
      />
    </div>
  )
}
