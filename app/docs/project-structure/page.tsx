import type { Metadata } from "next"
import { DocsPrevNext } from "@/components/docs/docs-prev-next"

export const metadata: Metadata = { title: "Project Structure" }

export default function ProjectStructurePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="docs-overline">Technical Reference</p>
        <h1 className="docs-h1">Project Structure</h1>
        <p className="docs-lead">
          A file-by-file reference for every meaningful file in the repository.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Root files</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead><tr><th>File</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>next.config.mjs</code></td><td>Next.js config — disables ESLint/TS build errors, disables image optimization</td></tr>
              <tr><td><code>tailwind.config.ts</code></td><td>Tailwind config — adds xs breakpoint (475px), CSS variable color tokens, animation keyframes</td></tr>
              <tr><td><code>components.json</code></td><td>shadcn/ui CLI config — points to component output directory and import alias</td></tr>
              <tr><td><code>package.json</code></td><td>Dependencies and npm scripts</td></tr>
              <tr><td><code>.gitignore</code></td><td>Ignores node_modules, .next, .env.local, etc.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">app/</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead><tr><th>File</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>layout.tsx</code></td><td>Root layout. Applies Inter font, wraps tree with ThemeProvider → LanguageProvider. Renders Toaster and Vercel Analytics.</td></tr>
              <tr><td><code>page.tsx</code></td><td>Landing page. Shows IntroAnimation, then MarketingPage. Manages auth state and navigates to /generate on CTA.</td></tr>
              <tr><td><code>globals.css</code></td><td>Tailwind directives, CSS custom properties for theming, prose styles, custom animations (twinkle, float), scrollbar styles.</td></tr>
              <tr><td><code>providers.tsx</code></td><td>Alternative Providers component (currently not used in the tree — layout.tsx handles providers directly).</td></tr>
              <tr><td><code>generate/page.tsx</code></td><td>Main application page. Full two-panel generate/preview layout. Manages all form state, auth state, usage quota logic, and API calls.</td></tr>
              <tr><td><code>pro/page.tsx</code></td><td>Pricing page. Renders plan details and triggers PayPal / UPI checkout flows. Includes UPI QR code modal.</td></tr>
              <tr><td><code>pro/success/page.tsx</code></td><td>Post-payment success page. Calls POST /api/paypal/capture-order to finalize the PayPal order.</td></tr>
              <tr><td><code>pro/success/loading.tsx</code></td><td>Suspense fallback for the success page while the capture request is in flight.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">app/api/</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead><tr><th>Route</th><th>Method</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>generate-readme/route.ts</code></td><td>POST</td><td>Main AI generation. GitHub fetch → live demo scrape → prompt → GPT-4o → response.</td></tr>
              <tr><td><code>rewrite-readme/route.ts</code></td><td>POST</td><td>AI rewrite with rotating vibe-specific prompts.</td></tr>
              <tr><td><code>rewrite-section/route.ts</code></td><td>POST</td><td>Single-section vibe rewrite (future UI use).</td></tr>
              <tr><td><code>auth/signup/route.ts</code></td><td>POST</td><td>Server-side sign-up with disposable email validation.</td></tr>
              <tr><td><code>auth/signin/route.ts</code></td><td>POST</td><td>Server-side sign-in (syntax validation only).</td></tr>
              <tr><td><code>auth/request-otp/route.ts</code></td><td>POST</td><td>Send OTP to existing account email.</td></tr>
              <tr><td><code>auth/verify-otp/route.ts</code></td><td>POST</td><td>Verify 6-digit OTP and return user object.</td></tr>
              <tr><td><code>usage/status/route.ts</code></td><td>GET</td><td>Check Pro status and remaining daily uses. Performs daily reset.</td></tr>
              <tr><td><code>usage/use/route.ts</code></td><td>POST</td><td>Increment Pro daily counter after successful generation.</td></tr>
              <tr><td><code>paypal/create-order/route.ts</code></td><td>POST</td><td>Create $5 PayPal order with user ID as custom_id.</td></tr>
              <tr><td><code>paypal/capture-order/route.ts</code></td><td>POST</td><td>Capture PayPal order and activate Pro in Supabase.</td></tr>
              <tr><td><code>paypal/webhook/route.ts</code></td><td>POST</td><td>PayPal PAYMENT.CAPTURE.COMPLETED webhook handler.</td></tr>
              <tr><td><code>upi/create-order/route.ts</code></td><td>POST</td><td>Generate UPI payment details and transaction ref.</td></tr>
              <tr><td><code>upi/success/route.ts</code></td><td>GET</td><td>Activate Pro in Supabase and redirect to /pro/success.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">components/</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead><tr><th>File</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>auth-modal.tsx</code></td><td>Sign-in / sign-up modal. Three views: main (tabs), forgot-password, verify-otp. Handles both email/password and OTP flows.</td></tr>
              <tr><td><code>footer.tsx</code></td><td>Shared footer with author links (Twitter, GitHub, personal site). Uses i18n for "Made with ❤️ by" text.</td></tr>
              <tr><td><code>intro-animation.tsx</code></td><td>Full-screen animated intro shown on first landing page load.</td></tr>
              <tr><td><code>language-switcher.tsx</code></td><td>Dropdown to switch between EN and DE. Calls setLanguage() from LanguageContext.</td></tr>
              <tr><td><code>loading-animation.tsx</code></td><td>Full-screen overlay shown during generation with animated animal illustrations.</td></tr>
              <tr><td><code>marketing-page.tsx</code></td><td>Landing page body: hero, vibe showcase with cycling preview, feature grid, CTA section.</td></tr>
              <tr><td><code>theme-provider.tsx</code></td><td>Thin wrapper re-exporting next-themes ThemeProvider with the project's default props.</td></tr>
              <tr><td><code>user-profile.tsx</code></td><td>Avatar + dropdown with user name/email, profile links (currently non-functional), and logout.</td></tr>
              <tr><td><code>ui/*</code></td><td>shadcn/ui primitives: avatar, badge, button, card, dropdown-menu, input, select, tabs, textarea, toast, toaster.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">lib/</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead><tr><th>File</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>email-validation.ts</code></td><td>Three-step email validation: trim/lowercase → Zod syntax → disposable domain check with subdomain traversal.</td></tr>
              <tr><td><code>language-context.tsx</code></td><td>React context providing t(key) translation function. Holds full EN + DE string maps. Persists selection in localStorage.</td></tr>
              <tr><td><code>llm.ts</code></td><td>Minimal OpenAI chat completions wrapper. Reads OPENAI_API_KEY from process.env. Throws on missing key.</td></tr>
              <tr><td><code>supabase.ts</code></td><td>Client-side Supabase client. Falls back to a safe mock (returns null sessions) if env vars are absent.</td></tr>
              <tr><td><code>supabase-server.ts</code></td><td>Server-side Supabase client using the service role key. No mock fallback — throws if env vars are missing.</td></tr>
              <tr><td><code>user-table.ts</code></td><td>Exports USER_TABLE constant (defaults to "users") and documents the expected schema as a comment.</td></tr>
              <tr><td><code>utils.ts</code></td><td>Exports cn() — the standard Tailwind class merger from clsx + tailwind-merge.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4">scripts/sql/</h2>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead><tr><th>File</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><code>001_create_users_table.sql</code></td><td>Creates the public.users table and subscription_end index in Supabase. Run manually in the SQL editor.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <DocsPrevNext
        prev={{ href: "/docs/local-development", title: "Local Development" }}
        next={{ href: "/docs/troubleshooting", title: "Troubleshooting" }}
      />
    </div>
  )
}
