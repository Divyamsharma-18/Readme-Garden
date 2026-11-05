# README Garden

**Created by Readme Garden (Quite Obvious)**

An AI-powered documentation tool that generates beautiful, personality-driven GitHub README files in seconds. Paste a repository URL, choose a vibe, and let the AI craft a polished Markdown document ready to copy or download.

## Quick Links

- **[Live Application](https://readmegarden.vercel.app/)** – Generate your README
- **[Documentation](https://readmegarden.vercel.app/docs)** – Complete technical documentation
- **[Generate README](https://readmegarden.vercel.app/generate)** – Start creating
- **[Support](https://readmegarden.vercel.app/support)** – Contribute to the project

## What It Does

README Garden connects to the GitHub API, reads your repository metadata and structure, optionally scrapes your live demo URL for context, then passes everything through a carefully crafted prompt to OpenAI's GPT-4o model. The output is a complete Markdown README that matches your chosen style—six personality presets ranging from crisp corporate documentation to humorous, emoji-filled write-ups.

Not satisfied with the first result? Hit **AI Rewrite** for a structurally different version that explores a completely new angle while maintaining the same vibe.

## Core Features

### GitHub Integration
Fetches repository metadata, programming languages, topics, and existing README content. Analyzes `package.json` when present to extract project name, description, keywords, scripts, and dependencies.

### Six Personality Vibes
Each vibe maps to a distinct set of instructions sent to the model:
- **Professional** – Formal, corporate, business-oriented
- **Friendly** – Warm, conversational, encouraging
- **Humorous** – Jokes, puns, witty analogies
- **Creative** – Artistic, expressive, metaphorical
- **Minimal** – Concise, essentials-only
- **Detailed** – Comprehensive, exhaustive, academic

### Live Demo Scraping
When you provide a live URL, the server fetches the page and extracts the `<title>` and `meta description` to enrich the AI prompt with context about what the application actually does.

### AI Rewrite
Generates a structurally different version on each attempt using rotating prompt variations. The model explores different organizational approaches, section ordering, and emphasis while respecting the same vibe.

### Markdown Preview & Editing
Live preview rendered with `react-markdown`, `remark-gfm`, and `rehype-highlight`. Switch to the Markdown tab to edit raw content directly. Copy to clipboard or download as `README.md` with one click.

### Authentication & Pro Tier
Passwordless OTP-based sign-in via Supabase Auth. Free users get 5 generations per email+device pair. Pro users ($5/30 days via PayPal or ₹399 via UPI) get 5 generations per day with daily resets tracked server-side.

### Fallback Generator
If the OpenAI API call fails, a template-based generator automatically produces a correctly formatted README using the same vibe logic and real repository data.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 with CSS variables |
| UI Components | shadcn/ui (Radix UI primitives) |
| Animations | Framer Motion |
| AI / LLM | OpenAI GPT-4o via REST |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| Payments | PayPal REST API + UPI deep links |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| Analytics | Vercel Analytics |

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-readme/        # Main generation endpoint
│   │   ├── rewrite-readme/         # AI rewrite endpoint
│   │   ├── rewrite-section/        # Section-level rewrite (future use)
│   │   ├── auth/                   # OTP request/verify + signin/signup
│   │   ├── paypal/                 # PayPal order creation + capture + webhook
│   │   ├── upi/                    # UPI order creation + success callback
│   │   └── usage/                  # Pro quota tracking (status + use)
│   ├── docs/                       # Full documentation site
│   ├── generate/                   # Main generation UI
│   ├── support/                    # Payment/donation page
│   ├── layout.tsx                  # Root layout with theme provider
│   ├── page.tsx                    # Landing page with intro animation
│   └── globals.css                 # Tailwind base + custom CSS variables
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── auth-modal.tsx              # Modal for signin/signup with OTP
│   ├── footer.tsx                  # Site footer
│   ├── language-switcher.tsx      # English/German toggle
│   ├── loading-animation.tsx      # Full-screen generation animation
│   ├── marketing-page.tsx         # Landing page hero + features + CTA
│   └── user-profile.tsx           # Header dropdown with logout
├── lib/
│   ├── email-validation.ts        # Custom email syntax + disposable domain check
│   ├── language-context.tsx       # i18n context (EN/DE translations)
│   ├── llm.ts                     # OpenAI API wrapper
│   ├── supabase.ts                # Supabase client initialization
│   └── utils.ts                   # Tailwind class merge utility
├── public/
│   └── images/                    # Icons and placeholder assets
├── .env.example                   # Environment variable template
├── next.config.mjs                # Next.js configuration
├── tailwind.config.ts             # Tailwind + shadcn/ui theme
└── tsconfig.json                  # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- Supabase project ([create one here](https://supabase.com))
- PayPal developer account (for Pro payments, optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Divyamsharma-18/Readme-Garden.git
cd Readme-Garden
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and provide your actual credentials:

```env
# Required
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
JWT_SECRET=your-random-secret-string

# Optional (for Pro tier)
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
PAYPAL_MODE=sandbox
```

4. **Set up the Supabase database**

Create a `users` table with the following schema:

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text,
  created_at timestamp with time zone default now()
);
```

Create a `pro_subscriptions` table:

```sql
create table pro_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);
```

Create a `usage_tracking` table:

```sql
create table usage_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  count integer default 0,
  unique(user_id, date)
);
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API authentication | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (client-side) | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (client-side) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) | Yes |
| `SUPABASE_URL` | Supabase project URL (server-side) | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key (server-side) | Yes |
| `SUPABASE_JWT_SECRET` | JWT secret for token validation | Yes |
| `JWT_SECRET` | Application-level JWT secret | Yes |
| `PAYPAL_CLIENT_ID` | PayPal REST API client ID | No (Pro tier only) |
| `PAYPAL_SECRET` | PayPal REST API secret | No (Pro tier only) |
| `PAYPAL_MODE` | PayPal environment (`sandbox` or `live`) | No (Pro tier only) |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key (future use) | No |
| `POSTGRES_URL` | Vercel Postgres connection string | No |
| `MONGODB_URI` | MongoDB connection string (unused) | No |

Never commit `.env.local` to version control. The `.env.example` file contains placeholders for all supported variables.

## Usage

1. Navigate to `/generate`
2. Paste a public GitHub repository URL
3. (Optional) Add a live demo URL and project description
4. Choose one of six personality vibes
5. Click **Generate README**
6. Review the rendered preview or edit the raw Markdown
7. Use **AI Rewrite** for a different structural take
8. Copy to clipboard or download as `README.md`

For detailed step-by-step instructions, see the [Quick Start guide](https://readmegarden.vercel.app/docs/quick-start).

## Available Scripts

```bash
npm run dev      # Start development server on port 3000
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint (currently set to pass during builds)
```

## Architecture

README Garden is a full-stack Next.js application using the App Router. All API routes are server-side and live in `app/api/`. Authentication is handled by Supabase Auth with OTP email verification. Usage quotas are tracked client-side in `localStorage` for anonymous and free users, and server-side in Supabase for Pro users.

The generation pipeline:
1. Parse GitHub URL on the server
2. Fetch repository metadata, file structure, languages, and existing README from GitHub API
3. Fetch and parse `package.json` if present
4. Scrape live demo URL for `<title>` and `meta description` if provided
5. Assemble a comprehensive prompt combining all context with vibe-specific instructions
6. Call OpenAI GPT-4o API (`temperature: 0.8`, `maxTokens: 2500`)
7. Fall back to template-based generator if OpenAI call fails
8. Return Markdown to client for rendering and editing

For a complete technical walkthrough, see the [How It Works documentation](https://readmegarden.vercel.app/docs/how-it-works).

## Internationalization

The UI supports English and German via a custom React context (`lib/language-context.tsx`). All user-facing strings are stored in translation objects. Language preference is saved to `localStorage`.

## Contributing

Contributions are welcome. Open an issue to discuss proposed changes or bug reports before submitting a pull request. Follow the existing code style and ensure all TypeScript types are properly defined.

## Deployment

The application is deployed on Vercel with automatic deployments from the main branch. The production environment uses:
- Vercel Analytics for usage tracking
- Supabase for authentication and database
- OpenAI API for README generation
- PayPal REST API for Pro subscriptions

To deploy your own instance:
1. Fork the repository
2. Import the project into Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy

## License

This project does not currently include a license file. Contact the repository owner for licensing information.

## Support

Help support the development of README Garden:
- **UPI**: `divyam18@ptaxis`
- **PayPal**: Visit [readmegarden.vercel.app/support](https://readmegarden.vercel.app/support)

---

Built with Next.js, TypeScript, Tailwind CSS, and GPT-4o.
