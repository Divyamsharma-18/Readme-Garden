"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "@/components/auth-modal"
import IntroAnimation from "@/components/intro-animation"
import { supabase } from "@/lib/supabase"
import MarketingPage from "@/components/marketing-page"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<{ username: string; email: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showIntroAnimation, setShowIntroAnimation] = useState(true)
  const [showMarketing, setShowMarketing] = useState(false)
  const [unauthDailyUsageCount, setUnauthDailyUsageCount] = useState(0)
  const [dailyUsageCount, setDailyUsageCount] = useState(0)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    const today = new Date().toDateString()

    // Check Supabase session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
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
    }

    checkSession()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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

    // Usage count logic for badge display
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
      authListener.subscription.unsubscribe()
    }
  }, [])

  const getRemainingUses = () => {
    if (!isAuthenticated) {
      return Math.max(0, 5 - unauthDailyUsageCount)
    } else {
      return Math.max(0, 10 - dailyUsageCount)
    }
  }

  const handleStarOnGitHub = () => {
    window.open("https://github.com/Divyamsharma-18/Readme-Garden", "_blank")
  }

  const handleLogin = async (user: { id: string; email: string; name: string }) => {
    setIsAuthenticated(true)
    setUserData({ username: user.name, email: user.email })
    setShowAuthModal(false)
    setDailyUsageCount(0)
    localStorage.setItem("readme-daily-usage-count-auth", "0")
    localStorage.setItem("readme-last-usage-date-auth", new Date().toDateString())
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Supabase logout error:", error.message)
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

  const handleIntroComplete = () => {
    setShowIntroAnimation(false)
    setShowMarketing(true)
  }

  const handleGetStarted = () => {
    router.push("/generate")
  }

  if (!mounted) {
    return null
  }

  const remainingUses = getRemainingUses()

  return (
    <div className="min-h-screen">
      {/* Intro Animation */}
      <AnimatePresence mode="wait">
        {showIntroAnimation && <IntroAnimation key="intro" onAnimationComplete={handleIntroComplete} />}
        {showMarketing && (
          <motion.div
            key="marketing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            {/* Header for Marketing Page */}
            <header className="fixed top-0 left-0 right-0 py-3 z-[60] px-4 sm:px-6 backdrop-blur-sm bg-black/20 py-3">
              <div className="max-w-7xl mx-auto flex justify-between items-center py-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-2 sm:space-x-3"
                >
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                    <Github className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      README Garden
                    </h1>
                    <p className="text-xs text-purple-300 hidden sm:block">Where boring docs go to bloom 🌱</p>
                  </div>
                </motion.div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStarOnGitHub}
                    className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-black/20 backdrop-blur-sm border-purple-600/30 text-purple-200 hover:bg-purple-900/20 text-xs sm:text-sm px-3"
                  >
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />
                    <span className="hidden xs:inline">Star on </span>GitHub
                  </Button>
                </div>
              </div>
            </header>

            {/* Marketing Page Content - Responsive padding-top */}
            <div className="pt-16 sm:pt-14 md:pt-12">
              <MarketingPage onGetStarted={handleGetStarted} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleLogin} />
    </div>
  )
}
