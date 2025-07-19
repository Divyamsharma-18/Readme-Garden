"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Sparkles, Moon, Sun, Copy, RefreshCw, Download, Wand2 } from "lucide-react"
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
  const [generatedReadme, setGeneratedReadme] = useState("")
  const [usageCount, setUsageCount] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    // Check usage count from localStorage
    const count = localStorage.getItem("readme-usage-count")
    const authStatus = localStorage.getItem("readme-auth-status")
    setUsageCount(count ? Number.parseInt(count) : 0)
    setIsAuthenticated(authStatus === "true")
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

    // Check usage limits
    if (usageCount >= 1 && !isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, vibe: selectedVibe }),
      })

      if (!response.ok) throw new Error("Failed to generate README")

      const data = await response.json()
      setGeneratedReadme(data.readme)

      // Update usage count
      const newCount = usageCount + 1
      setUsageCount(newCount)
      localStorage.setItem("readme-usage-count", newCount.toString())

      toast({
        title: "README Generated! 🎉",
        description: "Your beautiful README is ready!",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRewrite = async (section: string) => {
    try {
      const response = await fetch("/api/rewrite-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, vibe: selectedVibe }),
      })

      if (!response.ok) throw new Error("Failed to rewrite section")

      const data = await response.json()
      // Update the specific section in the README
      setGeneratedReadme((prev) => prev.replace(section, data.rewrittenSection))

      toast({
        title: "Section Rewritten! ✨",
        description: "The section has been refreshed with AI magic!",
      })
    } catch (error) {
      toast({
        title: "Rewrite Failed",
        description: "Couldn't rewrite the section. Please try again.",
        variant: "destructive",
      })
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen transition-all duration-700 relative overflow-hidden">
      {/* Dynamic Background */}
      <div
        className={`fixed inset-0 transition-all duration-700 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
        }`}
      />

      {/* Nature Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {theme === "light" ? (
          <>
            {/* Sun */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse shadow-lg"
            />

            {/* Clouds */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.4 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute top-20 left-1/4 w-32 h-16 bg-white rounded-full shadow-sm"
            />
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.3 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute top-32 right-1/3 w-24 h-12 bg-white rounded-full shadow-sm"
            />

            {/* Trees */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.25 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute bottom-0 left-10"
            >
              <div className="w-4 h-32 bg-amber-800 rounded-t-sm" />
              <div className="absolute -top-8 -left-6 w-16 h-16 bg-green-500 rounded-full" />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.2 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute bottom-0 right-20"
            >
              <div className="w-6 h-40 bg-amber-700 rounded-t-sm" />
              <div className="absolute -top-10 -left-7 w-20 h-20 bg-green-600 rounded-full" />
            </motion.div>

            {/* Flowers */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="absolute bottom-10 left-1/3 w-4 h-4 bg-pink-400 rounded-full shadow-sm"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="absolute bottom-16 left-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-sm"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 2.1 }}
              className="absolute bottom-12 right-1/4 w-5 h-5 bg-yellow-400 rounded-full shadow-sm"
            />

            {/* River */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 opacity-30"
            />
          </>
        ) : (
          <>
            {/* Moon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.4 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-16 h-16 bg-gray-200 rounded-full shadow-lg"
            />

            {/* Stars */}
            {[...Array(8)].map((_, i) => (
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
                  left: `${20 + i * 10}%`,
                  top: `${10 + (i % 3) * 15}%`,
                }}
              />
            ))}

            {/* Dark Trees */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.4 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute bottom-0 left-10"
            >
              <div className="w-4 h-32 bg-gray-800 rounded-t-sm" />
              <div className="absolute -top-8 -left-6 w-16 h-16 bg-gray-700 rounded-full" />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.35 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute bottom-0 right-20"
            >
              <div className="w-6 h-40 bg-gray-800 rounded-t-sm" />
              <div className="absolute -top-10 -left-7 w-20 h-20 bg-gray-700 rounded-full" />
            </motion.div>

            {/* Fireflies */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-lg"
                style={{
                  left: `${30 + i * 15}%`,
                  bottom: `${20 + (i % 2) * 20}%`,
                }}
              />
            ))}

            {/* Night River */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 opacity-20"
            />
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
              {isAuthenticated ? "∞ Uses" : `${1 - usageCount} Free Uses Left`}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-transparent"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {!isAuthenticated && (
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
                  disabled={isGenerating || !repoUrl || !selectedVibe}
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
                        <div dangerouslySetInnerHTML={{ __html: generatedReadme.replace(/\n/g, "<br>") }} />
                      </div>
                    </TabsContent>
                    <TabsContent value="code" className="mt-4">
                      <div className="relative">
                        <Textarea
                          value={generatedReadme}
                          onChange={(e) => setGeneratedReadme(e.target.value)}
                          className="min-h-[400px] font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                          onClick={() => handleRewrite(generatedReadme)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          AI Rewrite
                        </Button>
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
      <AnimatePresence>{isGenerating && <LoadingAnimation />}</AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setIsAuthenticated(true)
          localStorage.setItem("readme-auth-status", "true")
          setShowAuthModal(false)
        }}
      />
    </div>
  )
}
