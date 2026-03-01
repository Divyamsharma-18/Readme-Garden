"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Shield, Sparkles, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"
import { useLanguage } from "@/lib/language-context"

export default function ProPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCode, setQRCode] = useState<string>("")
  const [upiDetails, setUpiDetails] = useState<any>(null)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [paymentVerified, setPaymentVerified] = useState(false)

  useEffect(() => {
    // Set session loaded to true immediately to allow clicks while checking auth
    setSessionLoaded(true)

    // Check current session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const id = data.session?.user?.id || null
        console.log("[v0] Session user ID:", id)

        // #region agent log
        fetch("http://127.0.0.1:7462/ingest/4ef844b8-558d-459d-a120-26dd1f6b2825", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "b9e52e",
          },
          body: JSON.stringify({
            sessionId: "b9e52e",
            runId: "pre-fix",
            hypothesisId: "H1",
            location: "app/pro/page.tsx:35",
            message: "pro checkSession result",
            data: {
              hasSession: !!data.session,
              userId: id,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {})
        // #endregion

        setUserId(id)
      } catch (error) {
        console.error("[v0] Error getting session:", error)
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const id = session?.user?.id || null
      console.log("[v0] Auth state changed, user ID:", id)
      setUserId(id)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const startPayPalCheckout = async () => {
    // #region agent log
    fetch("http://127.0.0.1:7462/ingest/4ef844b8-558d-459d-a120-26dd1f6b2825", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "b9e52e",
      },
      body: JSON.stringify({
        sessionId: "b9e52e",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "app/pro/page.tsx:60",
        message: "startPayPalCheckout clicked",
        data: {
          userId,
          sessionLoaded,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    if (!userId) {
      toast({ title: t("pro.signIn"), description: t("pro.signInDesc"), variant: "destructive" })
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
        title: t("error.title"),
        description: e instanceof Error ? e.message : t("common.loading"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startUPICheckout = async () => {
    // #region agent log
    fetch("http://127.0.0.1:7462/ingest/4ef844b8-558d-459d-a120-26dd1f6b2825", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "b9e52e",
      },
      body: JSON.stringify({
        sessionId: "b9e52e",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "app/pro/page.tsx:103",
        message: "startUPICheckout clicked",
        data: {
          userId,
          sessionLoaded,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    if (!userId) {
      toast({ title: t("pro.signIn"), description: t("pro.signInDesc"), variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/upi/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create UPI payment")
      }

      // Generate QR code for UPI
      const upiString = `upi://pay?pa=${data.upiId}&pn=ReadmeGarden&am=${data.amount}&tn=Pro%20Access&tr=${data.transactionRef}`
      const qr = await QRCode.toDataURL(upiString, { width: 300 })
      
      setUpiDetails(data)
      setQRCode(qr)
      setShowQRModal(true)
    } catch (e) {
      toast({
        title: t("error.title"),
        description: e instanceof Error ? e.message : t("common.loading"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const verifyUPIPayment = async () => {
    if (!upiDetails?.transactionRef || !userId) return
    
    setVerifyingPayment(true)
    try {
      // Check if payment has been processed by calling the UPI success handler
      const response = await fetch(`/api/upi/success?userId=${userId}&transactionRef=${upiDetails.transactionRef}&amount=${upiDetails.amount}`)
      
      if (response.ok) {
        setPaymentVerified(true)
        toast({ 
          title: t("pro.paymentSuccess"), 
          description: t("pro.paymentSuccessDesc"), 
          variant: "default" 
        })
        
        // Redirect to success page after a brief delay
        setTimeout(() => {
          router.push(`/pro/success?token=${upiDetails.transactionRef}&method=upi&amount=${upiDetails.amount}`)
        }, 1500)
      } else {
        toast({
          title: t("error.title"),
          description: "Payment verification pending. Please try again.",
          variant: "default"
        })
      }
    } catch (error) {
      console.error("[v0] Payment verification error:", error)
      toast({
        title: t("error.title"),
        description: "Could not verify payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setVerifyingPayment(false)
    }
  }

  const confirmUPIPayment = async () => {
    // Just close the modal - user will click "Verify Payment" after completing UPI transaction
    setShowQRModal(false)
  }

  const startCheckout = startPayPalCheckout; // Declare startCheckout variable

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <Card className="w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            {t("pro.title")} <Badge className="ml-2">5 {t("common.loading").toLowerCase()}</Badge>
          </CardTitle>
          <p className="text-muted-foreground mt-2">{t("pro.description")}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30">
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4" /> {t("pro.benefit1")}
              </div>
              <div className="flex items-center gap-2 font-medium mt-1">
                <Shield className="w-4 h-4" /> {t("pro.benefit3")}
              </div>
              <div className="flex items-center gap-2 font-medium mt-1">
                <Sparkles className="w-4 h-4" /> {t("pro.benefit2")}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30">
              <div className="text-2xl font-bold">
                $5 <span className="text-sm font-normal text-muted-foreground">/ 30 days</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{t("pro.note")}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={startPayPalCheckout} 
              disabled={loading} 
              className="w-full sm:flex-1 rounded-xl"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? t("pro.processing") : t("pro.paypal")}
            </Button>
            <Button 
              onClick={startUPICheckout} 
              disabled={loading} 
              className="w-full sm:flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? t("pro.processing") : t("pro.upi")}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/generate")} 
              className="w-full sm:flex-1 rounded-xl"
            >
              {t("pro.back")}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">{t("pro.note")}</p>
        </CardContent>
      </Card>

      {/* UPI QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("pro.upi")}</CardTitle>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("pro.scanQR")}</p>
                {qrCode && (
                  <div className="flex justify-center">
                    <img src={qrCode || "/placeholder.svg"} alt="UPI QR Code" className="w-64 h-64" />
                  </div>
                )}
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{t("pro.payManually")}</p>
                <p className="font-mono text-sm font-semibold">{upiDetails?.upiId}</p>
                <p className="text-xs text-muted-foreground">{t("pro.amount")}: ₹{upiDetails?.amount}</p>
                <p className="text-xs text-muted-foreground">{t("pro.ref")}: {upiDetails?.transactionRef}</p>
              </div>

              {paymentVerified ? (
                <div className="text-center py-4">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-600">{t("pro.paymentSuccess")}</p>
                </div>
              ) : (
                <>
                  <Button 
                    onClick={verifyUPIPayment}
                    disabled={verifyingPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {verifyingPayment ? t("pro.verifying") : t("pro.verifyPayment")}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    {t("pro.scanQRInstruction")}
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowQRModal(false)
                      setPaymentVerified(false)
                    }}
                    disabled={verifyingPayment}
                    className="w-full"
                  >
                    {t("pro.cancel")}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
