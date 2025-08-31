"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Sparkles, Moon, Sun, Copy, RefreshCw, Download, Wand2, Star, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import LoadingAnimation from "@/components/loading-animation"
import AuthModal from "@/components/auth-modal"
import { Textarea } from "@/components/ui/textarea"
import UserProfile from "@/components/user-profile"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

// Markdown rendering imports
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

const vibeOptions = [
  { value: "professional", label: "🎯 Professional", description: "Clean, corporate, and to-the-point" },
  { value: "friendly", label: "😊 Friendly Professional", description: "Professional with a warm touch" },
  { value: "humorous", label: "😄 Humorous Professional", description: "Professional with jokes and wit" },
  { value: "creative", label: "🎨 Creative", description: "Artistic and expressive" },
  { value: "minimal", label: "✨ Minimal", description: "Simple and clean" },
  { value: "detailed", label: "📚 Detailed", description: "Comprehensive and thorough" },
]

// Daily usage caps
const UNAUTH_DAILY_LIMIT = 3 // 3 uses before sign up
const AUTH_DAILY_LIMIT = 5 // total 5 after sign in (2 more)

export default function GeneratePage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [liveDemoUrl, setLiveDemoUrl] = useState("")
  const [projectPurpose, setProjectPurpose] = useState("")
  const [selectedVibe, setSelectedVibe] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRewriting, setIsRewriting] = useState(false)
  const [generatedReadme, setGeneratedReadme] = useState("")
  const [rewriteCount, setRewriteCount] = useState(0)
  const [unauthDailyUsageCount, setUnauthDailyUsageCount] = useState(0)
  const [dailyUsageCount, setDailyUsageCount] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<{ username: string; email: string } | null>(null)
  const [activeTab, setActiveTab] = useState("preview")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const getRemainingUses = () => {
    if (!isAuthenticated) {
      return Math.max(0, UNAUTH_DAILY_LIMIT - unauthDailyUsageCount)
    } else {
      return Math.max(0, AUTH_DAILY_LIMIT - dailyUsageCount)
    }
  }

  useEffect(() => {
    setMounted(true)
    const today = new Date().toDateString()

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setIsAuthenticated(true)
        setUserData({
          username: (session.user as any).user_metadata?.full_name || session.user.email || "User",
          email: session.user.email || "user@example.com",
        })
      } else {
        setIsAuthenticated(false)
        setUserData(null)
      }
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setIsAuthenticated(true)
        setUserData({
          username: session.user.user_metadata?.full_name || session.user.email || "User",
          email: session.user.email || "user@example.com",
        })
      } else {
        setIsAuthenticated(false)
        setUserData(null)
      }
    })

    // Usage count logic
    const lastAuthUsageDate = localStorage.getItem("readme-last-usage-date-auth")
    const authDailyCount = localStorage.getItem("readme-daily-usage-count-auth")
    if (lastAuthUsageDate !== today) {
      setDailyUsageCount(0)
      localStorage.setItem("readme-daily-usage-count-auth", "0")
      localStorage.setItem("readme-last-usage-date-auth", today)
    } else {
      setDailyUsageCount(authDailyCount ? Number.parseInt(authDailyCount) : 0)
    }

    const lastUnauthUsageDate = localStorage.getItem("readme-last-usage-date-unauth")
    const unauthCount = localStorage.getItem("readme-daily-usage-count-unauth")
    if (lastUnauthUsageDate !== today) {
      setUnauthDailyUsageCount(0)
      localStorage.setItem("readme-daily-usage-count-unauth", "0")
      localStorage.setItem("readme-last-usage-date-unauth", today)
    } else {
      setUnauthDailyUsageCount(unauthCount ? Number.parseInt(unauthCount) : 0)
    }

    return () => {
      authListener?.subscription?.unsubscribe?.()
    }
  }, [])

  const handleGenerate = async () => {
    if (!repoUrl || !selectedVibe) {
      toast({
        title: "Missing Information",
        description: "Please enter a repository URL and select a vibe.",
        variant: "destructive",
      })
      return
    }

    const remainingUses = getRemainingUses()
    if (remainingUses <= 0) {
      if (!isAuthenticated) {
        setShowAuthModal(true)
        return
      } else {
        toast({
          title: "Daily Limit Reached",
          description: `You've used all ${AUTH_DAILY_LIMIT} generations for today. Come back tomorrow!`,
          variant: "destructive",
        })
        return
      }
    }

    setIsGenerating(true)
    setRewriteCount(0)

    try {
      const response = await fetch("/api/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, vibe: selectedVibe, liveDemoUrl, projectPurpose }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate README")
      }

      const data = await response.json()

      if (!data.readme) {
        throw new Error("No README content received")
      }

      setGeneratedReadme(data.readme)

      const today = new Date().toDateString()
      if (!isAuthenticated) {
        const newCount = unauthDailyUsageCount + 1
        setUnauthDailyUsageCount(newCount)
        localStorage.setItem("readme-daily-usage-count-unauth", newCount.toString())
        localStorage.setItem("readme-last-usage-date-unauth", today)
      } else {
        const newDailyCount = dailyUsageCount + 1
        setDailyUsageCount(newDailyCount)
        localStorage.setItem("readme-daily-usage-count-auth", newDailyCount.toString())
        localStorage.setItem("readme-last-usage-date-auth", today)
      }

      toast({
        title: "README Generated! 🎉",
        description: "Your beautiful README is ready!",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRewrite = useCallback(async () => {
    if (!generatedReadme || !selectedVibe) {
      toast({
        title: "Nothing to Rewrite",
        description: "Please generate a README first.",
        variant: "destructive",
      })
      return
    }

    const remainingUsesNow = getRemainingUses()
    if (remainingUsesNow <= 0) {
      if (!isAuthenticated) {
        setShowAuthModal(true)
      } else {
        toast({
          title: "Daily Limit Reached",
          description: `You've used all ${AUTH_DAILY_LIMIT} generations for today. Come back tomorrow!`,
          variant: "destructive",
        })
      }
      return
    }

    if (isRewriting) return

    setIsRewriting(true)
    const currentRewriteCount = rewriteCount + 1
    setRewriteCount(currentRewriteCount)

    try {
      const response = await fetch("/api/rewrite-readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          content: generatedReadme,
          vibe: selectedVibe,
          repoUrl,
          projectPurpose,
          rewriteCount: currentRewriteCount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to rewrite README")
      }

      const data = await response.json()

      if (!data.rewrittenReadme) {
        throw new Error("No rewritten content received")
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
      setGeneratedReadme(data.rewrittenReadme)

      // Charge one use credit on successful rewrite
      const today = new Date().toDateString()
      if (!isAuthenticated) {
        const newCount = unauthDailyUsageCount + 1
        setUnauthDailyUsageCount(newCount)
        localStorage.setItem("readme-daily-usage-count-unauth", newCount.toString())
        localStorage.setItem("readme-last-usage-date-unauth", today)
      } else {
        const newDailyCount = dailyUsageCount + 1
        setDailyUsageCount(newDailyCount)
        localStorage.setItem("readme-daily-usage-count-auth", newDailyCount.toString())
        localStorage.setItem("readme-last-usage-date-auth", today)
      }

      toast({
        title: `README Rewritten! ✨ (${currentRewriteCount})`,
        description: "Your README has been completely refreshed!",
      })
    } catch (error) {
      toast({
        title: "Rewrite Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsRewriting(false)
      }, 200)
    }
  }, [
    generatedReadme,
    selectedVibe,
    repoUrl,
    projectPurpose,
    isRewriting,
    rewriteCount,
    toast,
    isAuthenticated,
    unauthDailyUsageCount,
    dailyUsageCount,
  ])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReadme)
    toast({
      title: "Copied! 📋",
      description: "README copied to clipboard!",
    })
  }

  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "README.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleStarOnGitHub = () => {
    window.open("https://github.com/Divyamsharma-18/Readme-Garden", "_blank")
  }

  // Carry over today's unauth usage so sign-in only grants 2 more (total 5)
  const handleLogin = async (user: { id: string; email: string; name: string }) => {
    setIsAuthenticated(true)
    setUserData({ username: user.name, email: user.email })
    setShowAuthModal(false)

    const today = new Date().toDateString()
    const unauthCount = Number.parseInt(localStorage.getItem("readme-daily-usage-count-unauth") || "0")
    const lastUnauthDate = localStorage.getItem("readme-last-usage-date-unauth")

    // If it's the same day, carry usage; otherwise reset
    const carried = lastUnauthDate === today ? Math.min(unauthCount, AUTH_DAILY_LIMIT) : 0
    setDailyUsageCount(carried)
    localStorage.setItem("readme-daily-usage-count-auth", carried.toString())
    localStorage.setItem("readme-last-usage-date-auth", today)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setIsAuthenticated(false)
      setUserData(null)
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      })
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"
  const remainingUses = getRemainingUses()

  return (
    <div className="min-h-screen transition-all duration-700 relative flex flex-col">
      {/* Dynamic Background */}
      <div
        className={`fixed inset-0 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
        }`}
      />

      {/* Nature Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {!isDark ? (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse shadow-2xl"
              style={{ boxShadow: "0 0 50px rgba(251, 191, 36, 0.6)" }}
            />
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-16 h-16 bg-gray-200 rounded-full shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(229, 231, 235, 0.8)" }}
            />
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${15 + i * 7}%`,
                  top: `${8 + (i % 4) * 12}%`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                <Github className="w-8 h-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  README Garden
                </h1>
                <p className="text-sm text-muted-foreground">Grow beautiful READMEs with AI magic</p>
              </div>
            </Link>
          </motion.div>

          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <Badge variant="secondary" className="px-2 sm:px-3 py-1 shadow-sm flex text-xs">
              <span className="lg:hidden">
                {!isAuthenticated ? `${remainingUses}/${UNAUTH_DAILY_LIMIT}` : `${remainingUses}/${AUTH_DAILY_LIMIT}`}
              </span>
              <span className="hidden lg:inline">
                {!isAuthenticated
                  ? `${remainingUses}/${UNAUTH_DAILY_LIMIT} Free Uses Today`
                  : `${remainingUses}/${AUTH_DAILY_LIMIT} Uses Today`}
              </span>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStarOnGitHub}
              className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-transparent flex p-2"
            >
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="hidden lg:inline">Star on GitHub</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-transparent flex md:flex w-8 h-8 sm:w-10 sm:h-10"
            >
              {isDark ? <Sun className="w-3 h-3 sm:w-4 sm:h-4" /> : <Moon className="w-3 h-3 sm:w-4 sm:h-4" />}
            </Button>
            {isAuthenticated && userData ? (
              <UserProfile username={userData.username} email={userData.email} onLogout={handleLogout} />
            ) : (
              <>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-full shadow-sm hidden lg:flex bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  Sign In (+2 uses)
                </Button>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-full shadow-sm lg:hidden w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  size="icon"
                  aria-label="Sign in to get 2 more daily uses"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12 flex-grow w-full">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="min-w-0"
          >
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl w-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span>Create Your README</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Repository URL</label>
                  <Input
                    placeholder="https://github.com/username/repository"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Live Demo URL (Optional)</label>
                  <Input
                    type="url"
                    placeholder="https://your-live-demo.vercel.app"
                    value={liveDemoUrl}
                    onChange={(e) => setLiveDemoUrl(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Project Purpose / Description (Optional)</label>
                  <Textarea
                    placeholder="e.g., A tool to generate beautiful GitHub READMEs using AI."
                    value={projectPurpose}
                    onChange={(e) => setProjectPurpose(e.target.value)}
                    rows={4}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Provide a brief, compelling description of what your project does or the problem it solves.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Choose Your Vibe</label>
                  <Select value={selectedVibe} onValueChange={setSelectedVibe}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select a vibe for your README" />
                    </SelectTrigger>
                    <SelectContent>
                      {vibeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !repoUrl || !selectedVibe || remainingUses <= 0}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 to-indigo-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-shadow"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Growing Your README...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate README
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="min-w-0"
          >
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl h-full w-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your README {rewriteCount > 0 && `(v${rewriteCount + 1})`}</CardTitle>
                  {generatedReadme && (
                    <div className="flex space-x-2">
                      <Button
                        key={`rewrite-${rewriteCount}`}
                        variant="outline"
                        size="sm"
                        onClick={handleRewrite}
                        disabled={isRewriting || remainingUses <= 0}
                        className="flex items-center bg-transparent"
                      >
                        {isRewriting ? (
                          <RefreshCw className="w-3 h-3 mr-0 xs:mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3 mr-0 xs:mr-1" />
                        )}
                        <span className="hidden xs:inline">AI Rewrite</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-0 xs:mr-1" />
                        <span className="hidden xs:inline">Copy</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadReadme}>
                        <Download className="w-4 h-4 mr-0 xs:mr-1" />
                        <span className="hidden xs:inline">Download</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedReadme ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="min-w-0">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="code">Markdown</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4 min-w-0">
                      <div className="prose dark:prose-invert max-w-full max-h-96 overflow-y-auto break-words prose-pre:overflow-x-auto">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                          {generatedReadme}
                        </ReactMarkdown>
                      </div>
                    </TabsContent>
                    <TabsContent value="code" className="mt-4">
                      <div className="relative">
                        <Textarea
                          value={generatedReadme}
                          onChange={(e) => setGeneratedReadme(e.target.value)}
                          className="min-h-[400px] font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your beautiful README will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>{(isGenerating || isRewriting) && <LoadingAnimation />}</AnimatePresence>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleLogin} />
    </div>
  )
}
