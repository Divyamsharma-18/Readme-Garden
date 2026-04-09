"use client"

import { useEffect, useRef, useState } from "react"
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
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Set session loaded to true immediately to allow clicks while checking auth
    setSessionLoaded(true)
    let isMounted = true

    // Check current session once on mount
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const id = data.session?.user?.id || null
        if (isMounted) {
          setUserId(id)
          userIdRef.current = id
        }
      } catch (error) {
        console.error("[v0] Error getting session:", error)
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [])

  const startPayPalCheckout = async () => {
    const currentUserId = userIdRef.current
    if (!currentUserId) {
      toast({ title: t("pro.signIn"), description: t("pro.signInDesc"), variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to start checkout")
      }
      
      const data = await res.json()
      if (!data.approvalUrl) {
        throw new Error("No approval URL received")
      }

      // Open PayPal in new tab
      const win = window.open(data.approvalUrl, "_blank", "noopener,noreferrer")
      if (!win) {
        window.location.href = data.approvalUrl
      }
    } catch (e) {
      toast({
        title: t("error.title"),
        description: e instanceof Error ? e.message : "Failed to create PayPal order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startUPICheckout = async () => {
    const currentUserId = userIdRef.current
    if (!currentUserId) {
      toast({ title: t("pro.signIn"), description: t("pro.signInDesc"), variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/upi/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create UPI payment")
      }

      const data = await res.json()
      // Generate QR code for UPI
      const upiString = `upi://pay?pa=${data.upiId}&pn=ReadmeGarden&am=${data.amount}&tn=Pro%20Access&tr=${data.transactionRef}`
      const qr = await QRCode.toDataURL(upiString, { width: 300 })
      
      setUpiDetails(data)
      setQRCode(qr)
      setShowQRModal(true)
    } catch (e) {
      toast({
        title: t("error.title"),
        description: e instanceof Error ? e.message : "Failed to create UPI payment",
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
      // Verify payment by redirecting to the success handler
      // This will process the payment and update the subscription status
      window.location.href = `/api/upi/success?userId=${userId}&transactionRef=${upiDetails.transactionRef}&amount=${upiDetails.amount}`
    } catch (error) {
      console.error("[v0] Payment verification error:", error)
      toast({
        title: t("error.title"),
        description: "Could not verify payment. Please try again.",
        variant: "destructive"
      })
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
