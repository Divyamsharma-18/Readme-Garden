"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (userData: { username: string; email: string }) => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const { toast } = useToast()

  const handleAuth = async (type: "signin" | "signup") => {
    setIsLoading(true)

    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create user data
      const userData = {
        username: type === "signin" ? email.split("@")[0] : name,
        email: email,
      }

      toast({
        title: `${type === "signin" ? "Welcome back!" : "Welcome to README Garden!"} 🎉`,
        description: "You now have 5 README generations per day!",
      })

      onSuccess(userData)
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: "github" | "google") => {
    setIsLoading(true)
    console.log(
      `Simulating social login with ${provider}. For real authentication, integrate with Auth.js (NextAuth.js) or a similar OAuth solution.`,
    )
    try {
      // Simulate social auth
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create user data based on provider
      const userData = {
        username: provider === "github" ? "github_user" : "google_user",
        email: `${provider}_user@example.com`,
      }

      toast({
        title: "Welcome! 🎉",
        description: "Successfully signed in with " + provider,
      })

      onSuccess(userData)
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-2xl">
              <CardHeader className="relative">
                <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-2 top-2 rounded-full">
                  <X className="w-4 h-4" />
                </Button>
                <CardTitle className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span>Join README Garden</span>
                  </div>
                  <p className="text-sm font-normal text-muted-foreground">Get 5 README generations per day</p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <Button
                        onClick={() => handleAuth("signin")}
                        disabled={isLoading || !email || !password}
                        className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500"
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <Button
                        onClick={() => handleAuth("signup")}
                        disabled={isLoading || !email || !password || !name}
                        className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500"
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth("github")}
                    disabled={isLoading}
                    className="rounded-xl"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth("google")}
                    disabled={isLoading}
                    className="rounded-xl"
                  >
                    <Chrome className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
