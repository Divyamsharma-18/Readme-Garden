"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Sparkles, Moon, Sun, Copy, RefreshCw, Download, Wand2, Star } from "lucide-react"
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
import Image from "next/image"
import UserProfile from "@/components/user-profile"

// Markdown rendering imports
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight" // For syntax highlighting

const vibeOptions = [
  { value: "professional", label: "🎯 Professional", description: "Clean, corporate, and to-the-point" },
  { value: "friendly", label: "😊 Friendly Professional", description: "Professional with a warm touch" },
  { value: "humorous", label: "😄 Humorous Professional", description: "Professional with jokes and wit" },
  { value: "creative", label: "🎨 Creative", description: "Artistic and expressive" },
  { value: "minimal", label: "✨ Minimal", description: "Simple and clean" },
  { value: "detailed", label: "📚 Detailed", description: "Comprehensive and thorough" },
]

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [selectedVibe, setSelectedVibe] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRewriting, setIsRewriting] = useState(false)
  const [generatedReadme, setGeneratedReadme] = useState("")
  const [usageCount, setUsageCount] = useState(0)
  const [dailyUsageCount, setDailyUsageCount] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState({ username: "User", email: "user@example.com" })
  const [activeTab, setActiveTab] = useState("preview")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    // Check usage count from localStorage
    const count = localStorage.getItem("readme-usage-count")
    const authStatus = localStorage.getItem("readme-auth-status")
    const today = new Date().toDateString()
    const lastUsageDate = localStorage.getItem("readme-last-usage-date")
    const dailyCount = localStorage.getItem("readme-daily-usage-count")
    const savedUserData = localStorage.getItem("readme-user-data")

    setUsageCount(count ? Number.parseInt(count) : 0)
    setIsAuthenticated(authStatus === "true")

    if (savedUserData) {
      try {
        setUserData(JSON.parse(savedUserData))
      } catch (e) {
        console.error("Error parsing user data", e)
      }
    }

    // Reset daily count if it's a new day
    if (lastUsageDate !== today) {
      setDailyUsageCount(0)
      localStorage.setItem("readme-daily-usage-count", "0")
      localStorage.setItem("readme-last-usage-date", today)
    } else {
      setDailyUsageCount(dailyCount ? Number.parseInt(dailyCount) : 0)
    }
  }, [])

  const getRemainingUses = () => {
    if (!isAuthenticated) {
      return Math.max(0, 1 - usageCount)
    } else {
      return Math.max(0, 5 - dailyUsageCount)
    }
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

    // Check usage limits
    const remainingUses = getRemainingUses()
    if (remainingUses <= 0) {
      if (!isAuthenticated) {
        setShowAuthModal(true)
        return
      } else {
        toast({
          title: "Daily Limit Reached",
          description: "You've used all 5 generations for today. Come back tomorrow!",
          variant: "destructive",
        })
        return
      }
    }

    setIsGenerating(true)

    try {
      console.log("Generating README for:", repoUrl, "with vibe:", selectedVibe)

      const response = await fetch("/api/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, vibe: selectedVibe }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.error || "Failed to generate README")
      }

      const data = await response.json()
      console.log("Generated README length:", data.readme?.length)

      if (!data.readme) {
        throw new Error("No README content received")
      }

      setGeneratedReadme(data.readme)

      // Update usage counts
      if (!isAuthenticated) {
        const newCount = usageCount + 1
        setUsageCount(newCount)
        localStorage.setItem("readme-usage-count", newCount.toString())
      } else {
        const newDailyCount = dailyUsageCount + 1
        setDailyUsageCount(newDailyCount)
        localStorage.setItem("readme-daily-usage-count", newDailyCount.toString())
        localStorage.setItem("readme-last-usage-date", new Date().toDateString())
      }

      toast({
        title: "README Generated! 🎉",
        description: "Your beautiful README is ready!",
      })
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRewrite = async () => {
    if (!generatedReadme || !selectedVibe) {
      toast({
        title: "Nothing to Rewrite",
        description: "Please generate a README first.",
        variant: "destructive",
      })
      return
    }

    setIsRewriting(true)

    try {
      toast({
        title: "Rewriting README...",
        description: "Creating a fresh version with the same vibe.",
      })

      const response = await fetch("/api/rewrite-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: generatedReadme, vibe: selectedVibe }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Rewrite Error:", errorData)
        throw new Error(errorData.error || "Failed to rewrite README")
      }

      const data = await response.json()

      // Completely replace the content
      setGeneratedReadme(data.rewrittenReadme)

      toast({
        title: "README Rewritten! ✨",
        description: "Your README has been completely refreshed!",
      })
    } catch (error) {
      console.error("Rewrite error:", error)
      toast({
        title: "Rewrite Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRewriting(false)
    }
  }

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
    window.open("https://github.com/your-username/readme-garden", "_blank") // TODO: Replace with actual repo URL
  }

  const handleLogin = (userData: { username: string; email: string }) => {
    setIsAuthenticated(true)
    setUserData(userData)
    localStorage.setItem("readme-auth-status", "true")
    localStorage.setItem("readme-user-data", JSON.stringify(userData))
    setShowAuthModal(false)
    // Reset daily usage for new user
    setDailyUsageCount(0)
    localStorage.setItem("readme-daily-usage-count", "0")
    localStorage.setItem("readme-last-usage-date", new Date().toDateString())
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("readme-auth-status")
    localStorage.removeItem("readme-user-data")
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
    <div className="min-h-screen transition-all duration-700 relative overflow-hidden">
      {/* Dynamic Background */}
      <div
        className={`fixed inset-0 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
        }`}
      />

      {/* Nature Background Elements with Images */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {!isDark ? (
          <>
            {/* Sun */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse shadow-2xl"
              style={{
                boxShadow: "0 0 50px rgba(251, 191, 36, 0.6)",
              }}
            />

            {/* Day Clouds */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.7 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute top-20 left-1/4 w-32 h-16 overflow-hidden rounded-full"
            >
              <Image
                src="/images/day-clouds.png"
                alt="Day clouds"
                width={128}
                height={64}
                className="object-cover w-full h-full opacity-80"
              />
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.6 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute top-32 right-1/3 w-24 h-12 overflow-hidden rounded-full"
            >
              <Image
                src="/images/day-clouds.png"
                alt="Day clouds"
                width={96}
                height={48}
                className="object-cover w-full h-full opacity-70"
              />
            </motion.div>

            {/* Day Trees */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute bottom-0 left-10 w-16 h-32"
            >
              <Image
                src="/images/day-tree-1.png"
                alt="Day tree"
                width={64}
                height={128}
                className="object-cover w-full h-full"
              />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute bottom-0 right-20 w-20 h-40"
            >
              <Image
                src="/images/day-tree-2.png"
                alt="Day tree"
                width={80}
                height={160}
                className="object-cover w-full h-full"
              />
            </motion.div>

            {/* Day Flowers */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="absolute bottom-10 left-1/3 w-8 h-8 rounded-full overflow-hidden"
            >
              <Image
                src="/images/day-flowers.png"
                alt="Day flowers"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="absolute bottom-16 left-1/2 w-6 h-6 rounded-full overflow-hidden"
            >
              <Image
                src="/images/day-flowers.png"
                alt="Day flowers"
                width={24}
                height={24}
                className="object-cover w-full h-full"
              />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 2.1 }}
              className="absolute bottom-12 right-1/4 w-10 h-10 rounded-full overflow-hidden"
            >
              <Image
                src="/images/day-flowers.png"
                alt="Day flowers"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </motion.div>

            {/* Day River */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden"
            >
              <Image
                src="/images/day-river.png"
                alt="Day river"
                width={800}
                height={48}
                className="object-cover w-full h-full opacity-60"
              />
            </motion.div>
          </>
        ) : (
          <>
            {/* Moon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-16 h-16 bg-gray-200 rounded-full shadow-2xl"
              style={{
                boxShadow: "0 0 40px rgba(229, 231, 235, 0.8)",
              }}
            />

            {/* Stars */}
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

            {/* Night Clouds */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.4 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute top-20 left-1/4 w-32 h-16 overflow-hidden rounded-full"
            >
              <Image
                src="/images/night-clouds.png"
                alt="Night clouds"
                width={128}
                height={64}
                className="object-cover w-full h-full opacity-60"
              />
            </motion.div>

            {/* Night Trees */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute bottom-0 left-10 w-16 h-32"
            >
              <Image
                src="/images/night-tree-1.png"
                alt="Night tree"
                width={64}
                height={128}
                className="object-cover w-full h-full"
              />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute bottom-0 right-20 w-20 h-40"
            >
              <Image
                src="/images/night-tree-2.png"
                alt="Night tree"
                width={80}
                height={160}
                className="object-cover w-full h-full"
              />
            </motion.div>

            {/* Night Flowers */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="absolute bottom-10 left-1/3 w-8 h-8 rounded-full overflow-hidden"
            >
              <Image
                src="/images/night-flowers.png"
                alt="Night flowers"
                width={32}
                height={32}
                className="object-cover w-full h-full opacity-70"
              />
            </motion.div>

            {/* Fireflies */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.4, 0.8],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-lg"
                style={{
                  left: `${25 + i * 12}%`,
                  bottom: `${15 + (i % 3) * 15}%`,
                  boxShadow: "0 0 10px rgba(253, 224, 71, 0.8)",
                }}
              />
            ))}

            {/* Night River */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden"
            >
              <Image
                src="/images/night-river.png"
                alt="Night river"
                width={800}
                height={48}
                className="object-cover w-full h-full opacity-50"
              />
            </motion.div>
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
            <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-lg">
              <Github className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                README Garden
              </h1>
              <p className="text-sm text-muted-foreground">Grow beautiful READMEs with AI magic</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="px-3 py-1 shadow-sm">
              {isAuthenticated
                ? `${remainingUses}/5 Uses Today`
                : `${remainingUses} Free Use${remainingUses !== 1 ? "s" : ""} Left`}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStarOnGitHub}
              className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-transparent"
            >
              <Star className="w-4 h-4 mr-1" />
              Star on GitHub
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-transparent"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {isAuthenticated ? (
              <UserProfile username={userData.username} email={userData.email} onLogout={handleLogout} />
            ) : (
              <Button onClick={() => setShowAuthModal(true)} className="rounded-full shadow-sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
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
                  className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-shadow"
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your README</CardTitle>
                  {generatedReadme && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRewrite}
                        disabled={isRewriting}
                        className="flex items-center bg-transparent"
                      >
                        {isRewriting ? (
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3 mr-1" />
                        )}
                        AI Rewrite
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadReadme}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedReadme ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="code">Markdown</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                      <div className="prose dark:prose-invert max-w-none max-h-96 overflow-y-auto">
                        {/* Use ReactMarkdown for proper rendering */}
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

      {/* Loading Animation Overlay */}
      <AnimatePresence>{(isGenerating || isRewriting) && <LoadingAnimation />}</AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleLogin} />
    </div>
  )
}
