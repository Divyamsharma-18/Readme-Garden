"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Sparkles, Moon, Sun, Copy, RefreshCw, Download, Wand2, User, ArrowLeft, Crown } from "lucide-react"
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

// New policy
const ANON_TOTAL_LIMIT = 3 // per device (never resets)
const FREE_EMAIL_DEVICE_LIMIT = 5 // per email+device (never resets)
const PRO_DAILY_LIMIT = 5 // per day for Pro

// Storage keys
const DEVICE_ID_KEY = "readme-device-id-v1"
const ANON_TOTAL_KEY = "readme-usage-total-anon-v1"

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = globalThis.crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

function emailDeviceKey(email: string, deviceId: string) {
  return `readme-usage-total-email-device-v1:${email}:${deviceId}`
}

export default function GeneratePage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [liveDemoUrl, setLiveDemoUrl] = useState("")
  const [projectPurpose, setProjectPurpose] = useState("")
  const [selectedVibe, setSelectedVibe] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRewriting, setIsRewriting] = useState(false)
  const [generatedReadme, setGeneratedReadme] = useState("")
  const [rewriteCount, setRewriteCount] = useState(0)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<{ username: string; email: string; id?: string } | null>(null)

  const [activeTab, setActiveTab] = useState("preview")
  const [mounted, setMounted] = useState(false)
  const [deviceId, setDeviceId] = useState<string>("")
  const [anonTotalCount, setAnonTotalCount] = useState(0)
  const [emailDeviceTotalCount, setEmailDeviceTotalCount] = useState(0)

  // Pro server-authoritative state
  const [isPro, setIsPro] = useState(false)
  const [proRemainingToday, setProRemainingToday] = useState(0)

  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    // Ensure device id
    const id = getOrCreateDeviceId()
    setDeviceId(id)

    // Load anon total from device
    const anonTotal = Number.parseInt(localStorage.getItem(ANON_TOTAL_KEY) || "0")
    setAnonTotalCount(isNaN(anonTotal) ? 0 : anonTotal)

    // Check auth
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const username = session.user.user_metadata?.full_name || session.user.email || "User"
        const email = session.user.email || "user@example.com"
        setIsAuthenticated(true)
        setUserData({ username, email, id: session.user.id })
        // Merge anon usage into email+device usage (cap at 5)
        const k = emailDeviceKey(email, id)
        const prev = Number.parseInt(localStorage.getItem(k) || "0")
        const merged = Math.min(FREE_EMAIL_DEVICE_LIMIT, prev + anonTotal)
        localStorage.setItem(k, String(merged))
        setEmailDeviceTotalCount(merged)
        // Fetch pro status
        fetchProStatus(session.user.id)
      } else {
        setIsAuthenticated(false)
        setUserData(null)
      }
    }
    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const username = session.user.user_metadata?.full_name || session.user.email || "User"
        const email = session.user.email || "user@example.com"
        setIsAuthenticated(true)
        setUserData({ username, email, id: session.user.id })
        const k = emailDeviceKey(email, id)
        const prev = Number.parseInt(localStorage.getItem(k) || "0")
        const currAnon = Number.parseInt(localStorage.getItem(ANON_TOTAL_KEY) || "0")
        const merged = Math.min(FREE_EMAIL_DEVICE_LIMIT, prev + currAnon)
        localStorage.setItem(k, String(merged))
        setEmailDeviceTotalCount(merged)
        fetchProStatus(session.user.id)
      } else {
        setIsAuthenticated(false)
        setUserData(null)
        setIsPro(false)
        setProRemainingToday(0)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load email+device count when email or device id set
  useEffect(() => {
    if (isAuthenticated && userData?.email && deviceId) {
      const k = emailDeviceKey(userData.email, deviceId)
      const v = Number.parseInt(localStorage.getItem(k) || "0")
      setEmailDeviceTotalCount(isNaN(v) ? 0 : v)
    }
  }, [isAuthenticated, userData?.email, deviceId])

  const fetchProStatus = async (uid: string) => {
    try {
      const url = new URL("/api/usage/status", window.location.origin)
      url.searchParams.set("userId", uid)
      const res = await fetch(url.toString())
      const data = await res.json()
      if (data.isPro) {
        setIsPro(true)
        setProRemainingToday(data.remainingToday ?? 0)
      } else {
        setIsPro(false)
        setProRemainingToday(0)
      }
    } catch (e) {
      console.warn("Failed to fetch pro status")
    }
  }

  const getRemainingUses = () => {
    if (isPro) {
      return proRemainingToday
    }
    if (isAuthenticated && userData?.email) {
      return Math.max(0, FREE_EMAIL_DEVICE_LIMIT - emailDeviceTotalCount)
    }
    return Math.max(0, ANON_TOTAL_LIMIT - anonTotalCount)
  }

  const consumeUse = async () => {
    if (isPro && userData?.id) {
      const res = await fetch("/api/usage/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData.id }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Pro usage limit reached")
      }
      const data = await res.json()
      setProRemainingToday(data.remainingToday ?? Math.max(0, proRemainingToday - 1))
      return
    }

    if (isAuthenticated && userData?.email) {
      const k = emailDeviceKey(userData.email, deviceId)
      const prev = Number.parseInt(localStorage.getItem(k) || "0") || 0
      const next = Math.min(FREE_EMAIL_DEVICE_LIMIT, prev + 1)
      localStorage.setItem(k, String(next))
      setEmailDeviceTotalCount(next)
      return
    }

    // anonymous
    const nextAnon = Math.min(ANON_TOTAL_LIMIT, anonTotalCount + 1)
    localStorage.setItem(ANON_TOTAL_KEY, String(nextAnon))
    setAnonTotalCount(nextAnon)
  }

  const handleGenerate = async () => {
    if (!repoUrl || !selectedVibe) {
      toast({
        title: "Missing Information",
        description: "Please enter a repository URL and select a vibe.",
        variant: "destructive",
      })
      return
    }

    const remaining = getRemainingUses()
    if (remaining <= 0) {
      if (!isAuthenticated) {
        setShowAuthModal(true)
      } else if (!isPro) {
        toast({
          title: "Limit reached",
          description: "You've used all 5 free uses on this email + device.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Daily limit reached",
          description: "You've used all 5 Pro uses for today.",
          variant: "destructive",
        })
      }
      return
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
      if (!data.readme) throw new Error("No README content received")

      // consume one use after success
      await consumeUse()

      setGeneratedReadme(data.readme)
      toast({ title: "README Generated! 🎉", description: "Your beautiful README is ready!" })
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
      toast({ title: "Nothing to Rewrite", description: "Please generate a README first.", variant: "destructive" })
      return
    }

    const remaining = getRemainingUses()
    if (remaining <= 0) {
      if (!isAuthenticated) {
        setShowAuthModal(true)
      } else if (!isPro) {
        toast({
          title: "Limit reached",
          description: "You've used all 5 free uses on this email + device.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Daily limit reached",
          description: "You've used all 5 Pro uses for today.",
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
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
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
      if (!data.rewrittenReadme) throw new Error("No rewritten content received")

      await new Promise((r) => setTimeout(r, 100))
      // consume one use after success
      await consumeUse()

      setGeneratedReadme(data.rewrittenReadme)
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
      setTimeout(() => setIsRewriting(false), 200)
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
    isPro,
    anonTotalCount,
    emailDeviceTotalCount,
    proRemainingToday,
  ])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReadme)
    toast({ title: "Copied! 📋", description: "README copied to clipboard!" })
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

  const { theme: curTheme } = useTheme()
  const isDark = curTheme === "dark"

  const remainingUses = getRemainingUses()
  const badgeText = useMemo(() => {
    if (isPro) return `${remainingUses}/${PRO_DAILY_LIMIT} Uses Today`
    if (isAuthenticated) return `${remainingUses}/${FREE_EMAIL_DEVICE_LIMIT} Free Uses (email+device)`
    return `${remainingUses}/${ANON_TOTAL_LIMIT} Free Uses (device)`
  }, [isPro, isAuthenticated, remainingUses])

  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  const handleLogin = async (user: { id: string; email: string; name: string }) => {
    setIsAuthenticated(true)
    setUserData({ username: user.name, email: user.email, id: user.id })
    setShowAuthModal(false)
    // Merge anon usage into email+device usage
    const id = getOrCreateDeviceId()
    const prevEmailDevice = Number.parseInt(localStorage.getItem(emailDeviceKey(user.email, id)) || "0")
    const anon = Number.parseInt(localStorage.getItem(ANON_TOTAL_KEY) || "0")
    const merged = Math.min(
      FREE_EMAIL_DEVICE_LIMIT,
      (isNaN(prevEmailDevice) ? 0 : prevEmailDevice) + (isNaN(anon) ? 0 : anon),
    )
    localStorage.setItem(emailDeviceKey(user.email, id), String(merged))
    setEmailDeviceTotalCount(merged)
    await fetchProStatus(user.id)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" })
    } else {
      setIsAuthenticated(false)
      setUserData(null)
      setIsPro(false)
      setProRemainingToday(0)
      toast({ title: "Logged out successfully", description: "See you next time!" })
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen transition-all duration-700 relative flex flex-col">
      {/* Background */}
      <div
        className={`fixed inset-0 transition-all duration-700 ${isDark ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : "bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"}`}
      />

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
              <span className="hidden lg:inline">{badgeText}</span>
              <span className="lg:hidden">
                {remainingUses}/{isPro ? PRO_DAILY_LIMIT : isAuthenticated ? FREE_EMAIL_DEVICE_LIMIT : ANON_TOTAL_LIMIT}
              </span>
            </Badge>
            {!isPro && (
              <Link href="/pro">
                <Button variant="outline" size="sm" className="rounded-full bg-transparent flex p-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="hidden lg:inline">Go Pro</span>
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full shadow-sm bg-transparent w-8 h-8 sm:w-10 sm:h-10"
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
                  Sign In (5 total)
                </Button>
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-full shadow-sm lg:hidden w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  size="icon"
                  aria-label="Sign in"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12 flex-grow w-full">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
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
                {!isPro && (
                  <Link
                    href="/pro"
                    className="text-sm text-purple-600 dark:text-purple-300 underline underline-offset-4"
                  >
                    Want 5 uses per day? Go Pro
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Output */}
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
