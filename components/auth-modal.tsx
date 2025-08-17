"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Eye, EyeOff } from "lucide-react"
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
  const [showPassword, setShowPassword] = useState(false)
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
      // Clean error message to show only user-friendly text
      let cleanErrorMessage = "Authentication failed. Please try again."

      if (error instanceof Error) {
        const errorText = error.message
        // Extract just the user-friendly part before any technical details
        if (errorText.includes("Invalid login credentials")) {
          cleanErrorMessage = "Invalid login credentials"
        } else if (errorText.includes("User already registered")) {
          cleanErrorMessage = "User already registered"
        } else if (errorText.includes("Email not confirmed")) {
          cleanErrorMessage = "Please check your email to confirm your account"
        } else if (errorText.includes("Password should be at least")) {
          cleanErrorMessage = "Password should be at least 6 characters"
        } else {
          // For any other error, extract just the first sentence or line
          const firstLine = errorText.split("\n")[0].split(" at ")[0].trim()
          cleanErrorMessage = firstLine || "Authentication failed. Please try again."
        }
      }

      toast({
        title: "Authentication Failed",
        description: cleanErrorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-xl pr-10"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        onClick={() => handleAuth("signin")}
                        disabled={isLoading || !email || !password}
                        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-xl pr-10"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <Button
                        onClick={() => handleAuth("signup")}
                        disabled={isLoading || !email || !password || !name}
                        className="w-full rounded-xl bg-gradient-to-r bg-gradient-to-r from-blue-500 to-purple-500 text-neutral-50"
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

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
