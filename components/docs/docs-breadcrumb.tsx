"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { allDocPages } from "./docs-config"

export function DocsBreadcrumb() {
  const pathname = usePathname()

  const current = allDocPages.find(
    (p) => p.href === pathname || (p.href !== "/docs" && pathname.startsWith(p.href + "/")),
  )

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/docs" className="hover:text-foreground transition-colors">
            Docs
          </Link>
        </li>
        {current && current.href !== "/docs" && (
          <>
            <li aria-hidden>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <span className="text-foreground font-medium">{current.title}</span>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}
