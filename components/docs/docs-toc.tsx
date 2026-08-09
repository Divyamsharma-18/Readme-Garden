"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export function DocsToC() {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const pathname = usePathname()
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Re-scan headings whenever the page changes
  useEffect(() => {
    // Small delay so the page's React tree has fully painted
    const t = setTimeout(() => {
      const main = document.querySelector("main")
      if (!main) return

      const nodes = Array.from(main.querySelectorAll("h2, h3")) as HTMLElement[]

      const extracted: TocItem[] = nodes
        .filter((el) => el.textContent?.trim())
        .map((el) => {
          const text = el.textContent?.trim() ?? ""
          // Assign a stable id if the element doesn't already have one
          if (!el.id) {
            el.id = slugify(text)
          }
          return {
            id: el.id,
            text,
            level: el.tagName === "H2" ? 2 : 3,
          }
        })
        // deduplicate ids (very rare but safe)
        .filter((item, idx, arr) => arr.findIndex((x) => x.id === item.id) === idx)

      setItems(extracted)
      setActiveId(extracted[0]?.id ?? "")
    }, 80)

    return () => clearTimeout(t)
  }, [pathname])

  // IntersectionObserver to highlight active section
  useEffect(() => {
    if (items.length === 0) return

    observerRef.current?.disconnect()

    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: "-56px 0px -60% 0px", // account for sticky header height
        threshold: 0,
      },
    )

    headingEls.forEach((el) => observerRef.current!.observe(el))

    return () => observerRef.current?.disconnect()
  }, [items])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // Smooth scroll with offset for the sticky header (56px)
    const y = el.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top: y, behavior: "smooth" })
    setActiveId(id)
  }

  if (items.length < 2) return null

  return (
    <aside className="hidden xl:block w-52 flex-shrink-0 py-8">
      <div className="sticky top-20">
        {/* Label */}
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-foreground/60 px-1">
          On this page
        </p>

        {/* Items */}
        <nav aria-label="Table of contents">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    "group w-full text-left rounded-md px-2 py-1 text-[13px] leading-snug transition-all duration-150 outline-none",
                    item.level === 3 && "pl-4",
                    activeId === item.id
                      ? "text-purple-400 font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Left accent bar */}
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-block h-full w-px flex-shrink-0 rounded-full transition-all duration-150 self-stretch min-h-[1em]",
                        activeId === item.id
                          ? "bg-purple-400"
                          : "bg-transparent group-hover:bg-border",
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{item.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider + back to top */}
        <div className="mt-5 pt-4 border-t border-border/40">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors px-1"
          >
            <svg
              className="h-3 w-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </aside>
  )
}
