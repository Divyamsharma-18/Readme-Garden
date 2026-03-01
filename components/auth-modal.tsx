"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (userData: { id: string; email: string; name: string }) => void
}

type AuthStep = "main" | "forgot-password" | "verify-otp"

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [authStep, setAuthStep] = useState<AuthStep>("main")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpEmail, setOtpEmail] = useState("")
  const { toast } = useToast()

  const handleAuth = async (type: "signin" | "signup") => {
    setIsLoading(true)

    try {
      if (type === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error || !data.user) {
          throw new Error(error?.message || "Authentication failed.")
        }

        const user = data.user

        toast({
          title: "Welcome back! 🎉",
          description: "You now have 5 README generations per day!",
        })

        onSuccess({
          id: user.id,
          email: user.email || email,
          name: (user.user_metadata as any)?.full_name || user.email || "User",
        })
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        })

        if (error || !data.user) {
          throw new Error(error?.message || "Account creation failed. Please try again.")
        }

        const user = data.user

        if (!data.session && !user.email_confirmed_at) {
          toast({
            title: "Account Created! 🎉",
            description: "Please check your email to confirm your account before signing in.",
            variant: "default",
          })
        } else {
          toast({
            title: "Welcome to README Garden! 🎉",
            description: "You now have 5 README generations per day!",
          })

          onSuccess({
            id: user.id,
            email: user.email || email,
            name: (user.user_metadata as any)?.full_name || user.email || "User",
          })
        }
      }

      setAuthStep("main")
      setEmail("")
      setPassword("")
      setName("")
    } catch (error) {
      let cleanErrorMessage = "Authentication failed. Please try again."

      if (error instanceof Error) {
        const errorText = error.message.toLowerCase()

        if (errorText.includes("invalid") && errorText.includes("credentials")) {
          cleanErrorMessage = "Invalid email or password"
        } else if (errorText.includes("user already registered")) {
          cleanErrorMessage = "An account with this email already exists"
        } else if (errorText.includes("email not confirmed")) {
          cleanErrorMessage = "Please check your email to confirm your account"
        } else if (errorText.includes("password should be at least")) {
          cleanErrorMessage = "Password must be at least 6 characters"
        } else if (errorText.includes("too many")) {
          cleanErrorMessage = "Too many attempts. Please try again later"
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

  const handleRequestOTP = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: otpEmail,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: "OTP Sent! 📧",
        description: "Check your email for the one-time password.",
      })

      setAuthStep("verify-otp")
    } catch (error) {
      let cleanErrorMessage = "Failed to send OTP. Please try again."

      if (error instanceof Error) {
        cleanErrorMessage = error.message
      }

      toast({
        title: "Error",
        description: cleanErrorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: otp,
        type: "email",
      })

      if (error || !data.user) {
        throw new Error(error?.message || "OTP verification failed")
      }

      const user = data.user

      toast({
        title: "Welcome back! 🎉",
        description: "You are now signed in.",
      })

      onSuccess({
        id: user.id,
        email: user.email || otpEmail,
        name: (user.user_metadata as any)?.full_name || user.email || "User",
      })
      setAuthStep("main")
      setOtpEmail("")
      setOtp("")
    } catch (error) {
      let cleanErrorMessage = "OTP verification failed. Please try again."

      if (error instanceof Error) {
        cleanErrorMessage = error.message
      }

      toast({
        title: "Verification Failed",
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

  const handleClose = () => {
    setAuthStep("main")
    setEmail("")
    setPassword("")
    setName("")
    setOtp("")
    setOtpEmail("")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
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
                {authStep !== "main" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAuthStep("main")}
                    className="absolute left-2 top-2 rounded-full"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="absolute right-2 top-2 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardTitle className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="p-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span>
                      {authStep === "main" && "Join README Garden"}
                      {authStep === "forgot-password" && "Reset Password"}
                      {authStep === "verify-otp" && "Enter OTP"}
                    </span>
                  </div>
                  <p className="text-sm font-normal text-muted-foreground">
                    {authStep === "main" && "Get 5 README generations per day"}
                    {authStep === "forgot-password" && "We'll send you an OTP to reset your password"}
                    {authStep === "verify-otp" && "Enter the OTP from your email"}
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {authStep === "main" && (
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
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                        <Button
                          variant="ghost"
                          className="w-full text-sm"
                          onClick={() => {
                            setAuthStep("forgot-password")
                            setOtpEmail(email)
                          }}
                        >
                          Forgot Password?
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
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <Button
                          onClick={() => handleAuth("signup")}
                          disabled={isLoading || !email || !password || !name}
                          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-neutral-50"
                        >
                          {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}

                {authStep === "forgot-password" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter your email address and we'll send you an OTP to sign in.
                    </p>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="rounded-xl"
                    />
                    <Button
                      onClick={handleRequestOTP}
                      disabled={isLoading || !otpEmail}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </div>
                )}

                {authStep === "verify-otp" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      We've sent an OTP to <span className="font-semibold">{otpEmail}</span>. Enter it below to sign in.
                    </p>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength="6"
                      className="rounded-xl text-center text-sm tracking-widest"
                    />
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={isLoading || otp.length !== 6}
                      className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-sm"
                      onClick={() => {
                        setAuthStep("forgot-password")
                        setOtp("")
                      }}
                    >
                      Send OTP Again
                    </Button>
                  </div>
                )}

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
