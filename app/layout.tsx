import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "README Garden - Grow Beautiful READMEs with AI",
  description:
    "Create stunning GitHub README files with AI-powered generation. Choose your vibe and let our garden grow the perfect documentation for your projects.",
  keywords: "README, GitHub, AI, documentation, generator, markdown",
=======
  title: "README Garden",
  description: "Grow beautiful READMEs with AI magic",
>>>>>>> 3cfdf99cba412755336d5912269aaf45a17c9429
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
