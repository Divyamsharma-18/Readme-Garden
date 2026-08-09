export interface NavItem {
  title: string
  href: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const docsNav: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "How It Works", href: "/docs/how-it-works" },
      { title: "Features", href: "/docs/features" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Authentication", href: "/docs/authentication" },
      { title: "Usage & Quotas", href: "/docs/usage-and-quotas" },
      { title: "Pro & Payments", href: "/docs/pro-and-payments" },
    ],
  },
  {
    title: "Technical Reference",
    items: [
      { title: "API Reference", href: "/docs/api-reference" },
      { title: "Architecture", href: "/docs/architecture" },
      { title: "Configuration", href: "/docs/configuration" },
      { title: "Local Development", href: "/docs/local-development" },
      { title: "Project Structure", href: "/docs/project-structure" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Troubleshooting", href: "/docs/troubleshooting" },
      { title: "Contributing", href: "/docs/contributing" },
    ],
  },
]

// Flat list for prev/next navigation and search
export const allDocPages: NavItem[] = docsNav.flatMap((g) => g.items)
