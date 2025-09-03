"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function SuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const orderId = params.get("token") || params.get("orderId") // PayPal sends "token"
    if (!orderId) {
      setError("Missing order token from PayPal")
      return
    }
    ;(async () => {
      try {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: orderId }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to capture payment")
        }
        setDone(true)
        toast({ title: "You're Pro now!", description: "Enjoy 5 uses per day for the next 30 days." })
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error")
      }
    })()
  }, [params, toast])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <Card className="w-full max-w-lg bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Payment {done ? "Successful" : error ? "Failed" : "Processing..."}</CardTitle>
        </CardHeader>
        <CardContent>
          {done ? (
            <>
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
              <p className="text-muted-foreground mb-6">Your Pro subscription is active.</p>
              <Button onClick={() => router.push("/generate")} className="rounded-xl">
                Back to Generate
              </Button>
            </>
          ) : error ? (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <p className="text-red-500 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => router.push("/pro")} className="rounded-xl">
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => router.push("/generate")} className="rounded-xl">
                  Back to Generate
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Please wait...</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
