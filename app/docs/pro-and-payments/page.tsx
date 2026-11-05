import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Support & Donations" }

export default function ProAndPaymentsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Guides</p>
        <h1 className="docs-h1">Support &amp; Donations</h1>
        <p className="docs-lead">
          README Garden is free to use! If you find it helpful, you can support the project through
          donations via UPI or PayPal. All contributions help maintain and improve the service.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Buy Me a Coffee</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The <strong>/support</strong> page has been redesigned as a donation page. 
          Instead of processing payments through payment gateways, it provides direct links to support
          the developer through personal UPI and PayPal accounts.
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500" />
            <span><strong className="text-foreground">No payment processing</strong> - direct links to personal payment accounts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500" />
            <span><strong className="text-foreground">Optional support</strong> - donations are voluntary and don't unlock features</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500" />
            <span><strong className="text-foreground">Two payment methods</strong> - UPI for Indian users, PayPal for international supporters</span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">UPI Donations (India)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Indian users can support the project directly via UPI. The page displays a UPI ID and
          generates a QR code that can be scanned with any UPI app.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">UPI ID</p>
            <code className="font-mono text-sm font-semibold">divyam18@ptaxis</code>
          </div>

          <div className="docs-callout docs-callout-info">
            <p className="text-sm">
              The UPI QR code is generated client-side using the <code className="docs-inline-code">qrcode</code> npm package.
              Users can scan the QR with any UPI app (Google Pay, PhonePe, Paytm, etc.) or manually enter the UPI ID.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">PayPal Donations (International)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          International supporters can contribute via PayPal. Once configured, the page will display
          a button that opens the PayPal donation link in a new tab.
        </p>

        <div className="docs-callout docs-callout-warning">
          <p className="text-sm">
            The PayPal link needs to be configured in <code className="docs-inline-code">app/support/page.tsx</code>.
            Update the <code className="docs-inline-code">PAYPAL_LINK</code> constant with your PayPal.me URL
            or donation link once available.
          </p>
        </div>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/usage-and-quotas", title: "Usage & Quotas" }}
        next={{ href: "/docs/api-reference", title: "API Reference" }}
      />
    </div>
  )
}
