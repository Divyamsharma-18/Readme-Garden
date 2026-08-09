import type React from "react"
import type { Metadata } from "next"
import DocsLayout from "@/components/docs/docs-layout"

export const metadata: Metadata = {
  title: {
    template: "%s — README Garden Docs",
    default: "Documentation — README Garden",
  },
  description:
    "Complete documentation for README Garden. Learn how to generate beautiful GitHub READMEs with AI, understand the architecture, and contribute to the project.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>
}
