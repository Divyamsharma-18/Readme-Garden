"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"
import { useLanguage } from "@/lib/language-context"

export default function BuyMeCoffeePage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const router = useRouter()
  const { t } = useLanguage()
  const [showUPIQR, setShowUPIQR] = useState(false)
  const [qrCode, setQRCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  
  // UPI details - hardcoded
  const UPI_ID = "divyam18@ptaxis"
  const PAYPAL_LINK = "" // Will be provided later

  useEffect(() => {
    // Generate UPI QR code on mount
    const generateQR = async () => {
      const upiString = `upi://pay?pa=${UPI_ID}&pn=README Garden Support`
      const qr = await QRCode.toDataURL(upiString, { width: 300 })
      setQRCode(qr)
    }
    generateQR()
  }, [])

  const copyUPIId = () => {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-xl bg-white dark:bg-gray-900 border shadow-sm">
        <CardHeader className="text-center pb-6 space-y-2">
          <CardTitle className="text-2xl font-semibold text-foreground">
            {t("support.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t("support.description")}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* UPI Payment */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">{t("support.upiTitle")}</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyUPIId}
                className="h-7 text-xs"
              >
                {copied ? <><Check className="w-3 h-3 mr-1" /> {t("support.copied")}</> : <><Copy className="w-3 h-3 mr-1" /> {t("support.copy")}</>}
              </Button>
            </div>
            <code className="block text-sm font-mono bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded border border-gray-200 dark:border-gray-700">
              {UPI_ID}
            </code>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowUPIQR(!showUPIQR)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                {showUPIQR ? t("support.hideQR") : t("support.showQR")}
              </Button>
              <Button
                onClick={() => window.open(`upi://pay?pa=${UPI_ID}&pn=README Garden`, "_blank")}
                size="sm"
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black"
              >
                {t("support.payViaUPI")}
              </Button>
            </div>
            {showUPIQR && qrCode && (
              <div className="flex justify-center pt-2">
                <img src={qrCode} alt="UPI QR Code" className="w-48 h-48 border border-gray-200 dark:border-gray-700 rounded" />
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">{t("support.or")}</span>
            </div>
          </div>

          {/* PayPal Payment */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">{t("support.paypalTitle")}</h3>
            {PAYPAL_LINK ? (
              <Button
                onClick={() => window.open(PAYPAL_LINK, "_blank", "noopener,noreferrer")}
                size="sm"
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black"
              >
                {t("support.donatePayPal")}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {t("support.paypalSoon")}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/generate")}
              className="w-full"
              size="sm"
            >
              {t("support.backToGenerator")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
