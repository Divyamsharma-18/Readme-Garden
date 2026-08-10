"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Github, Menu, X, ArrowLeft, Sprout, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { DocsSidebar } from "./docs-sidebar"
import { DocsBreadcrumb } from "./docs-breadcrumb"
import { DocsSearch } from "./docs-search"
import { DocsToC } from "./docs-toc"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Render a placeholder the same size during SSR to avoid layout shift */}
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </Button>
  )
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Top nav bar ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-14 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="flex h-full items-center gap-3 px-6">

          {/* Mobile: hamburger */}
          <button
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-2 flex-shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 shadow-sm">
              <Sprout className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-foreground">README Garden</span>
          </Link>

          {/* Separator */}
          <span className="hidden sm:block text-border/80 select-none text-lg font-light">/</span>

          {/* Docs label */}
          <Link href="/docs" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <DocsSearch className="hidden sm:flex" />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* GitHub */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a
              href="https://github.com/Divyamsharma-18/Readme-Garden"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="h-4 w-4" />
              <span className="hidden md:inline text-sm">GitHub</span>
            </a>
          </Button>

          {/* Back to app */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-1.5 rounded-lg border-border/60 text-xs"
            onClick={() => router.push("/generate")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            App
          </Button>
        </div>
      </header>

      {/* ── Mobile search bar (below header) ───────────────────────────── */}
      <div className="sm:hidden border-b border-border/60 bg-background/80 backdrop-blur-md px-4 py-2">
        <DocsSearch className="w-full" />
      </div>

      {/* ── Mobile nav overlay ─────────────────────────────────────────── */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute top-14 left-0 bottom-0 w-72 bg-background border-r border-border/60 overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <DocsSidebar onNavClick={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="w-full px-4 lg:px-8">
        <div className="flex gap-8 lg:gap-12">

          {/* ── Sidebar (desktop) ──────────────────────────────────────── */}
          <aside
            className={cn(
              "hidden lg:block w-56 xl:w-64 flex-shrink-0 py-8",
              "sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto",
              "scrollbar-thin",
            )}
          >
            <DocsSidebar />
          </aside>

          {/* ── Content ────────────────────────────────────────────────── */}
          <main className="min-w-0 flex-1 py-8 lg:py-10">
            <DocsBreadcrumb />
            {children}

            {/* Footer inside content area */}
            <footer className="mt-16 pt-8 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between flex-wrap gap-2">
              <span>README Garden documentation</span>
              <Link
                href="https://github.com/Divyamsharma-18/Readme-Garden"
                className="hover:text-foreground transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-3.5 w-3.5" />
                View on GitHub
              </Link>
            </footer>
          </main>

          {/* ── On this page (desktop xl+) ──────────────────────────────── */}
          <DocsToC />
        </div>
      </div>
    </div>
  )
}
