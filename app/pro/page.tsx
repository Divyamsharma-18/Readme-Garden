"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Shield, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ProPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { toast } = useToast()
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      const id = data.session?.user?.id || null
      setUserId(id)
    }
    getSession()
  }, [])

  const startCheckout = async () => {
    if (!userId) {
      toast({ title: "Sign in required", description: "Please sign in to upgrade to Pro.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!res.ok || !data.approvalUrl) {
        throw new Error(data.error || "Failed to start checkout")
      }

      // Prefer opening PayPal in a new tab to avoid iframe/sandbox blocking in previews
      const win = window.open(data.approvalUrl, "_blank", "noopener,noreferrer")
      if (!win) {
        // Popup blocked; try top-level navigation as a fallback
        try {
          if (window.top) {
            window.top.location.href = data.approvalUrl
            return
          }
        } catch {
          // Cross-origin top navigation blocked; use current window
          window.location.href = data.approvalUrl
          return
        }
      }
    } catch (e) {
      toast({
        title: "Checkout failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <Card className="w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Go Pro <Badge className="ml-2">5 uses/day</Badge>
          </CardTitle>
          <p className="text-muted-foreground mt-2">Unlimited days? Not yet. But 5 fresh seeds bloom every day 🌱</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4" /> 5 uses per day
              </div>
              <div className="flex items-center gap-2 font-medium mt-1">
                <Shield className="w-4 h-4" /> 30 days Pro access
              </div>
              <div className="flex items-center gap-2 font-medium mt-1">
                <Sparkles className="w-4 h-4" /> Priority improvements
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30">
              <div className="text-2xl font-bold">
                $5 <span className="text-sm font-normal text-muted-foreground">/ 30 days</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Simple checkout with PayPal.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={startCheckout} disabled={loading} className="w-full sm:w-auto rounded-xl">
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? "Starting Checkout..." : "Pay with PayPal"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/generate")} className="w-full sm:w-auto rounded-xl">
              Back to Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Note: UPI (₹399) planned for future.</p>
        </CardContent>
      </Card>
    </div>
  )
}
