"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { docsNav } from "./docs-config"
import { cn } from "@/lib/utils"

export function DocsSidebar({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-6" aria-label="Documentation navigation">
      {docsNav.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-foreground/80">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive =
                item.href === "/docs"
                  ? pathname === "/docs"
                  : pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavClick}
                    className={cn(
                      "flex w-full items-center rounded-lg px-3 py-1.5 text-sm transition-all duration-150",
                      isActive
                        ? "bg-purple-500/15 text-purple-400 font-medium"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
