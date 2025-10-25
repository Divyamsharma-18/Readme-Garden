import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "README Garden - Grow Beautiful READMEs with AI",
  description:
    "Create stunning GitHub README files with AI-powered generation. Choose your vibe and let our garden grow the perfect documentation for your projects.",
  keywords: "README, GitHub, AI, documentation, generator, markdown",
  icons: {
    icon: "/icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
