"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "de"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "header.title": "README Garden",
    "header.subtitle": "Where boring docs go to bloom 🌱",
    "header.github": "Star on GitHub",
    "header.github.short": "GitHub",

    // Navigation
    "nav.generate": "Generate",
    "nav.pro": "Go Pro",
    "nav.signin": "Sign In",
    "nav.back": "Back",

    // Home Page
    "home.title": "Create Beautiful READMEs with AI",
    "home.subtitle": "Transform your project documentation in seconds",
    "home.getstarted": "Get Started",
    "home.remaining": "Remaining uses today",
    "home.signout": "Sign Out",
    "home.welcome": "Welcome",

    // Pro Page
    "pro.title": "Upgrade to Pro",
    "pro.description": "Unlock unlimited README generations and advanced features",
    "pro.benefit1": "Unlimited Daily Generations",
    "pro.benefit2": "Advanced AI Vibes",
    "pro.benefit3": "Priority Support",
    "pro.price": "Get Pro Access",
    "pro.paypal": "PayPal ($5)",
    "pro.upi": "UPI (₹399)",
    "pro.back": "Back",
    "pro.note": "Choose your preferred payment method. Both unlock 30 days Pro access.",
    "pro.signIn": "Sign in required",
    "pro.signInDesc": "Please sign in to upgrade to Pro.",
    "pro.processing": "Processing...",
    "pro.loading": "Loading...",
    "pro.complete": "I've Completed Payment",
    "pro.cancel": "Cancel",
    "pro.scanQR": "Scan QR Code with any UPI app",
    "pro.payManually": "Or pay manually:",
    "pro.amount": "Amount",
    "pro.ref": "Ref",

    // Auth
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgotPassword": "Forgot Password?",
    "auth.otp": "OTP",
    "auth.enterOTP": "Enter OTP",
    "auth.sendOTP": "Send OTP",
    "auth.verify": "Verify",
    "auth.request": "Request OTP",
    "auth.requestOTP": "Request OTP",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.or": "or",

    // Generate Page
    "generate.title": "Generate README",
    "generate.description": "Select your vibe and generate a beautiful README",
    "generate.vibe": "Choose Your Vibe",
    "generate.generate": "Generate README",
    "generate.generating": "Generating...",
    "generate.copy": "Copy to Clipboard",
    "generate.copied": "Copied!",

    // Errors
    "error.title": "Error",
    "error.tryAgain": "Try Again",
    "error.close": "Close",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.success": "Success",
    "common.language": "Language",
  },
  de: {
    // Header
    "header.title": "README Garden",
    "header.subtitle": "Wo langweilige Dokumentation erblüht 🌱",
    "header.github": "Auf GitHub bewerten",
    "header.github.short": "GitHub",

    // Navigation
    "nav.generate": "Generieren",
    "nav.pro": "Pro",
    "nav.signin": "Anmelden",
    "nav.back": "Zurück",

    // Home Page
    "home.title": "Erstelle schöne READMEs mit KI",
    "home.subtitle": "Transformiere deine Projektdokumentation in Sekunden",
    "home.getstarted": "Erste Schritte",
    "home.remaining": "Verbleibende Einsätze heute",
    "home.signout": "Abmelden",
    "home.welcome": "Willkommen",

    // Pro Page
    "pro.title": "Upgrade auf Pro",
    "pro.description": "Schalte unbegrenzte README-Generierungen und erweiterte Funktionen frei",
    "pro.benefit1": "Unbegrenzte tägliche Generierungen",
    "pro.benefit2": "Erweiterte KI-Vibes",
    "pro.benefit3": "Prioritätsunterstützung",
    "pro.price": "Pro-Zugang erhalten",
    "pro.paypal": "PayPal ($5)",
    "pro.upi": "UPI (₹399)",
    "pro.back": "Zurück",
    "pro.note": "Wähle deine bevorzugte Zahlungsmethode. Beide Methoden entsperren 30 Tage Pro-Zugang.",
    "pro.signIn": "Anmeldung erforderlich",
    "pro.signInDesc": "Bitte melde dich an, um Pro zu aktivieren.",
    "pro.processing": "Verarbeitung läuft...",
    "pro.loading": "Wird geladen...",
    "pro.complete": "Zahlung abgeschlossen",
    "pro.cancel": "Abbrechen",
    "pro.scanQR": "QR-Code mit einer beliebigen UPI-App scannen",
    "pro.payManually": "Oder manuell bezahlen:",
    "pro.amount": "Betrag",
    "pro.ref": "Referenz",

    // Auth
    "auth.signin": "Anmelden",
    "auth.signup": "Registrieren",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.forgotPassword": "Passwort vergessen?",
    "auth.otp": "OTP",
    "auth.enterOTP": "Gib OTP ein",
    "auth.sendOTP": "OTP senden",
    "auth.verify": "Verifizieren",
    "auth.request": "OTP anfordern",
    "auth.requestOTP": "OTP anfordern",
    "auth.noAccount": "Hast du noch kein Konto?",
    "auth.haveAccount": "Du hast bereits ein Konto?",
    "auth.or": "oder",

    // Generate Page
    "generate.title": "README generieren",
    "generate.description": "Wähle deinen Vibe und generiere eine schöne README",
    "generate.vibe": "Wähle deinen Vibe",
    "generate.generate": "README generieren",
    "generate.generating": "Generieren läuft...",
    "generate.copy": "In Zwischenablage kopieren",
    "generate.copied": "Kopiert!",

    // Errors
    "error.title": "Fehler",
    "error.tryAgain": "Versuche erneut",
    "error.close": "Schließen",

    // Common
    "common.loading": "Wird geladen...",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.success": "Erfolg",
    "common.language": "Sprache",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem("preferred-language") as Language | null
    if (saved && (saved === "en" || saved === "de")) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("preferred-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
