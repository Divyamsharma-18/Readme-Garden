import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface DocsPrevNextProps {
  prev?: { href: string; title: string }
  next?: { href: string; title: string }
}

export function DocsPrevNext({ prev, next }: DocsPrevNextProps) {
  return (
    <div className="mt-12 flex items-center justify-between gap-4 border-t border-border/60 pt-8">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/30 px-4 py-3 text-sm transition-all duration-200 hover:border-purple-500/40 hover:bg-card/60"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors flex-shrink-0" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="font-medium text-foreground group-hover:text-purple-400 transition-colors">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/30 px-4 py-3 text-sm transition-all duration-200 hover:border-purple-500/40 hover:bg-card/60 ml-auto"
        >
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="font-medium text-foreground group-hover:text-purple-400 transition-colors">{next.title}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-400 transition-colors flex-shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
