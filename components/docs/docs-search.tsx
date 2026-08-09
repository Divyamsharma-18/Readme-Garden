"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ArrowRight } from "lucide-react"
import { allDocPages } from "./docs-config"
import { cn } from "@/lib/utils"

// Search index — page title + keywords for matching
const searchIndex = [
  { title: "Introduction", href: "/docs", keywords: "readme garden overview what is features tech stack" },
  { title: "Quick Start", href: "/docs/quick-start", keywords: "generate first readme steps vibe select url" },
  { title: "How It Works", href: "/docs/how-it-works", keywords: "pipeline github api fetch prompt openai gpt fallback rewrite" },
  { title: "Features", href: "/docs/features", keywords: "vibes professional friendly humorous creative minimal detailed preview copy download inline edit i18n theme dark light" },
  { title: "Authentication", href: "/docs/authentication", keywords: "sign in sign up login otp email password supabase session" },
  { title: "Usage & Quotas", href: "/docs/usage-and-quotas", keywords: "limits quota anonymous free pro daily reset device id localStorage" },
  { title: "Pro & Payments", href: "/docs/pro-and-payments", keywords: "paypal upi payment upgrade subscription 30 days $5 ₹399" },
  { title: "API Reference", href: "/docs/api-reference", keywords: "endpoints routes http post get generate rewrite auth usage paypal upi" },
  { title: "Architecture", href: "/docs/architecture", keywords: "directory structure folder files request flow state management external services vercel" },
  { title: "Configuration", href: "/docs/configuration", keywords: "environment variables env OPENAI SUPABASE PAYPAL keys database schema sql" },
  { title: "Local Development", href: "/docs/local-development", keywords: "setup install clone npm dev server prerequisites run locally" },
  { title: "Project Structure", href: "/docs/project-structure", keywords: "files folders app api components lib scripts reference" },
  { title: "Troubleshooting", href: "/docs/troubleshooting", keywords: "errors problems fix debug generation failed otp payment supabase" },
  { title: "Contributing", href: "/docs/contributing", keywords: "pull request fork branch commit open source contribute" },
]

function highlight(text: string, query: string) {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-purple-500/25 text-purple-300 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function DocsSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const results = query.trim()
    ? searchIndex.filter((page) =>
        `${page.title} ${page.keywords}`.toLowerCase().includes(query.toLowerCase()),
      )
    : []

  const openSearch = useCallback(() => {
    setOpen(true)
    setQuery("")
    setSelectedIndex(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery("")
  }, [])

  const navigate = useCallback(
    (href: string) => {
      router.push(href)
      closeSearch()
    },
    [router, closeSearch],
  )

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        open ? closeSearch() : openSearch()
      }
      if (e.key === "Escape") closeSearch()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, openSearch, closeSearch])

  // Arrow key navigation inside search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].href)
    }
  }

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={openSearch}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:border-purple-500/40 hover:bg-muted/50 hover:text-foreground",
          className,
        )}
        aria-label="Search documentation"
      >
        <Search className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="hidden sm:inline">Search docs…</span>
        <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border border-border/60 bg-muted px-1.5 py-0.5 text-xs text-muted-foreground font-mono">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* Search modal */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
          onClick={(e) => e.target === overlayRef.current && closeSearch()}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSearch} />

          {/* Dialog */}
          <div className="relative w-full max-w-xl rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/40 overflow-hidden">
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search documentation…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                aria-label="Search documentation"
                aria-autocomplete="list"
                aria-controls="docs-search-results"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={closeSearch}
                className="text-xs text-muted-foreground border border-border/60 rounded px-1.5 py-0.5 hover:text-foreground transition-colors hidden sm:block"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div id="docs-search-results" role="listbox" className="max-h-72 overflow-y-auto py-2">
              {query.trim() === "" ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Start typing to search…
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No results for &quot;<span className="text-foreground">{query}</span>&quot;
                </p>
              ) : (
                results.map((page, i) => (
                  <button
                    key={page.href}
                    role="option"
                    aria-selected={i === selectedIndex}
                    onClick={() => navigate(page.href)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors",
                      i === selectedIndex ? "bg-purple-500/10 text-foreground" : "text-muted-foreground hover:bg-muted/30",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Search className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />
                      <span className="text-sm font-medium truncate">{highlight(page.title, query)}</span>
                    </div>
                    {i === selectedIndex && (
                      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-purple-400" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer hint */}
            {results.length > 0 && (
              <div className="border-t border-border/60 px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><kbd className="border border-border/60 rounded px-1">↑</kbd><kbd className="border border-border/60 rounded px-1">↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="border border-border/60 rounded px-1">↵</kbd> open</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
