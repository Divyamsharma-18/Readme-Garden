"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User } from "lucide-react" // Removed Github, Chrome imports
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
      const endpoint = type === "signin" ? "/api/auth/signin" : "/api/auth/signup"
      const body = type === "signin" ? { email, password } : { email, password, name }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.")
      }

      // Handle email confirmation message if present
      if (data.emailConfirmationRequired) {
        toast({
          title: "Account Created! 🎉",
          description: "Please check your email to confirm your account before signing in.",
          variant: "default",
        })
      } else {
        toast({
          title: `${type === "signin" ? "Welcome back!" : "Welcome to README Garden!"} 🎉`,
          description: "You now have 10 README generations per day!",
        })
      }

      onSuccess(data.user)
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Removed handleSocialAuth function

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
                  <p className="text-sm font-normal text-muted-foreground">Get 10 README generations per day</p>
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

                {/* Removed the "Or continue with" separator and social login buttons */}

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
