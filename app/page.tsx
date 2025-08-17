"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, Moon, Sun, Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import AuthModal from "@/components/auth-modal"
import Image from "next/image"
import UserProfile from "@/components/user-profile"
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
    window.open("https://github.com/your-username/readme-garden", "_blank")
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

  const isDark = theme === "dark"
  const remainingUses = getRemainingUses()

  return (
    <div className="min-h-screen transition-all duration-700 relative overflow-hidden flex flex-col">
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
          >
            {/* Header for Marketing Page */}
            <header className="fixed top-0 left-0 right-0 z-50 p-6 backdrop-blur-sm bg-white/10 dark:bg-black/10">
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
                    <p className="text-sm text-muted-foreground">Where boring docs go to bloom 🌱</p>
                  </div>
                </motion.div>

                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1 shadow-sm hidden sm:flex">
                    {isAuthenticated ? `${remainingUses}/10 Uses Today` : `${remainingUses}/5 Free Uses Today`}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStarOnGitHub}
                    className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-white/20 dark:bg-black/20 backdrop-blur-sm border-white/30 dark:border-white/10 hidden sm:flex"
                  >
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    Star on GitHub
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleStarOnGitHub}
                    className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-white/20 dark:bg-black/20 backdrop-blur-sm border-white/30 dark:border-white/10 sm:hidden"
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full shadow-sm hover:shadow-md transition-shadow bg-white/20 dark:bg-black/20 backdrop-blur-sm border-white/30 dark:border-white/10"
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                  {isAuthenticated && userData ? (
                    <UserProfile username={userData.username} email={userData.email} onLogout={handleLogout} />
                  ) : (
                    <>
                      <Button
                        onClick={() => setShowAuthModal(true)}
                        className="rounded-full shadow-sm hidden sm:flex bg-white/20 dark:bg-black/20 backdrop-blur-sm border-white/30 dark:border-white/10"
                        variant="outline"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => setShowAuthModal(true)}
                        className="rounded-full shadow-sm sm:hidden bg-white/20 dark:bg-black/20 backdrop-blur-sm border-white/30 dark:border-white/10"
                        size="icon"
                        variant="outline"
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </header>

            {/* Marketing Page Content */}
            <div className="pt-24">
              <MarketingPage onGetStarted={handleGetStarted} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleLogin} />
    </div>
  )
}
