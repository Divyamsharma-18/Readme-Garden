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

    // Hero Section
    "hero.title1": "Stop Staring at",
    "hero.title2": "Blank READMEs",
    "hero.description": "Turn your GitHub repos from \"meh\" to \"wow\" in 10 seconds. Choose your vibe, let AI do the magic.",
    "hero.badge1": "30-second generation",
    "hero.badge2": "6 unique vibes",
    "hero.badge3": "1000+ developers",
    "hero.cta": "Grow My README",
    "hero.tagline": "Free forever • No signup required • 5 generations daily",

    // Vibes Section
    "vibes.title1": "Choose Your",
    "vibes.title2": "Personality",
    "vibes.description": "Every project has a personality. Let your README reflect yours with our unique vibe system.",
    "vibes.professional": "Professional",
    "vibes.professional_desc": "Clean, corporate, and to-the-point",
    "vibes.humorous": "Humorous",
    "vibes.humorous_desc": "Professional with jokes and wit",
    "vibes.creative": "Creative",
    "vibes.creative_desc": "Artistic and expressive",
    "vibes.preview": "README Preview",

    // Vibes Options (Generate Page)
    "vibe.option.professional.label": "🎯 Professional",
    "vibe.option.professional.desc": "Clean, corporate, and to-the-point",
    "vibe.option.friendly.label": "😊 Friendly Professional",
    "vibe.option.friendly.desc": "Professional with a warm touch",
    "vibe.option.humorous.label": "😄 Humorous Professional",
    "vibe.option.humorous.desc": "Professional with jokes and wit",
    "vibe.option.creative.label": "🎨 Creative",
    "vibe.option.creative.desc": "Artistic and expressive",
    "vibe.option.minimal.label": "✨ Minimal",
    "vibe.option.minimal.desc": "Simple and clean",
    "vibe.option.detailed.label": "📚 Detailed",
    "vibe.option.detailed.desc": "Comprehensive and thorough",

    // Features Section
    "features.title1": "Everything You Need to",
    "features.title2": "Shine",
    "features.feature1": "Smart Analysis",
    "features.feature1_desc": "Analyzes your GitHub repo, package.json, and live demos to understand your project",
    "features.feature2": "6 Unique Vibes",
    "features.feature2_desc": "Professional, Friendly, Humorous, Creative, Minimal, or Detailed - match your style",
    "features.feature3": "AI Rewrite Magic",
    "features.feature3_desc": "Not happy? Hit rewrite and get a completely different version in the same vibe",
    "features.feature4": "One-Click Actions",
    "features.feature4_desc": "Copy to clipboard, download as .md, or edit inline - whatever works for you",
    "features.feature5": "Lightning Fast",
    "features.feature5_desc": "Generate comprehensive READMEs in under 10 seconds, not in 30 minutes",
    "features.feature6": "Always Improving",
    "features.feature6_desc": "Regular updates, new vibes, and features based on community feedback",

    // CTA Section
    "cta.title1": "Ready to Grow Your",
    "cta.title2": "README Garden?",
    "cta.description": "Join thousands of developers who've transformed their GitHub presence. Start growing beautiful documentation today.",
    "cta.button": "Start Growing Now",
    "cta.tagline": "No credit card required • Free forever • Takes 10 seconds",

    // Footer
    "footer.made_with": "Made with",
    "footer.by": "by",

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
    "generate.selectVibePlaceholder": "Select a vibe for your README",
    "generate.generate": "Generate README",
    "generate.growing": "Growing Your README...",
    "generate.generating": "Generating...",
    "generate.copy": "Copy",
    "generate.copied": "Copied!",
    "generate.download": "Download",
    "generate.repoUrl": "Repository URL",
    "generate.repoPlaceholder": "https://github.com/username/repository",
    "generate.liveDemo": "Live Demo URL (Optional)",
    "generate.liveDemoPlaceholder": "https://your-live-demo.vercel.app",
    "generate.projectPurpose": "Project Purpose (Optional)",
    "generate.projectPurposePlaceholder": "Describe what your project does...",
    "generate.projectPurposeDescLabel": "Project Purpose / Description (Optional)",
    "generate.projectPurposeExample": "e.g., A tool to generate beautiful GitHub READMEs using AI.",
    "generate.projectPurposeTooltip": "Provide a brief, compelling description of what your project does or the problem it solves.",
    "generate.missingInfo": "Missing Information",
    "generate.missingInfoDesc": "Please enter a repository URL and select a vibe.",
    "generate.limitReached": "Limit reached",
    "generate.limitReachedFree": "You've used all 5 free uses on this email + device.",
    "generate.limitReachedPro": "You've used all 5 Pro uses for today.",
    "generate.generationFailed": "Generation Failed",
    "generate.generationSuccess": "README Generated!",
    "generate.generationSuccessDesc": "Your beautiful README is ready!",
    "generate.rewriteFailed": "Rewrite Failed",
    "generate.rewriteNothing": "Nothing to Rewrite",
    "generate.rewriteNothingDesc": "Please generate a README first.",
    "generate.rewriteSuccess": "README Rewritten!",
    "generate.rewriteSuccessDesc": "Your README has been completely refreshed!",
    "generate.preview": "Preview",
    "generate.markdown": "Markdown",
    "generate.aiRewrite": "AI Rewrite",
    "generate.rewrite": "Rewrite",
    "generate.usesToday": "Uses Today",
    "generate.freeUses": "Free Uses (email+device)",
    "generate.deviceUses": "Free Uses (device)",
    "generate.goPro": "Go Pro",
    "generate.wantMore": "Want 5 uses per day? Go Pro",
    "generate.signIn": "Sign In (5 total)",
    "generate.growBeautiful": "Grow beautiful READMEs with AI magic",
    "generate.logoutSuccess": "Logged out successfully",
    "generate.logoutSuccessDesc": "See you next time!",
    "generate.logoutFailed": "Logout Failed",
    "generate.yourReadme": "Your README",
    "generate.emptyState": "Your beautiful README will appear here",

    // Loading Animation
    "loading.title": "Growing Your README Garden 🌱",
    "loading.subtitle": "Crafting your perfect README with AI magic ✨",
    "loading.bunny.message": "Bunny is hopping to the carrot...",
    "loading.bunny.action": "munch munch! 😋",
    "loading.bear.message": "Teddy bear found some honey...",
    "loading.bear.action": "dipping paw with giggles! 🤭",
    "loading.bee.message": "Bees are buzzing around flowers...",
    "loading.bee.action": "landing with sparkly trails! ✨",
    "loading.cat.message": "Kitty is chasing the yarn ball...",
    "loading.cat.action": "pouncing with pure joy! 😸",
    "loading.turtle.message": "Turtle is slowly walking to the leaf...",
    "loading.turtle.action": "curling up for a cozy nap! 😴",

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
    "header.github": "Stern auf",
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

    // Hero Section
    "hero.title1": "Höre auf, auf",
    "hero.title2": "leere READMEs zu starren",
    "hero.description": "Verwandle deine GitHub-Repos in 10 Sekunden von \"meh\" zu \"wow\". Wähle deinen Vibe und lass die KI die Magie wirken.",
    "hero.badge1": "30-Sekunden-Generierung",
    "hero.badge2": "6 einzigartige Vibes",
    "hero.badge3": "1000+ Entwickler",
    "hero.cta": "Meine README vergrößern",
    "hero.tagline": "Kostenlos für immer • Keine Registrierung erforderlich • 5 Generierungen täglich",

    // Vibes Section
    "vibes.title1": "Wähle deine",
    "vibes.title2": "Persönlichkeit",
    "vibes.description": "Jedes Projekt hat eine Persönlichkeit. Lass deine README deine mit unserem einzigartigen Vibe-System widerspiegeln.",
    "vibes.professional": "Professionell",
    "vibes.professional_desc": "Sauber, geschäftlich und auf den Punkt gebracht",
    "vibes.humorous": "Humorvoll",
    "vibes.humorous_desc": "Professionell mit Witzen und Witz",
    "vibes.creative": "Kreativ",
    "vibes.creative_desc": "Künstlerisch und ausdrucksstark",
    "vibes.preview": "README-Vorschau",

    // Vibes Options (Generate Page)
    "vibe.option.professional.label": "🎯 Professionell",
    "vibe.option.professional.desc": "Sauber, geschäftlich und auf den Punkt gebracht",
    "vibe.option.friendly.label": "😊 Freundlich Professionell",
    "vibe.option.friendly.desc": "Professionell mit einer warmen Note",
    "vibe.option.humorous.label": "😄 Humorvoll Professionell",
    "vibe.option.humorous.desc": "Professionell mit Witz und Charme",
    "vibe.option.creative.label": "🎨 Kreativ",
    "vibe.option.creative.desc": "Künstlerisch und ausdrucksstark",
    "vibe.option.minimal.label": "✨ Minimal",
    "vibe.option.minimal.desc": "Einfach und sauber",
    "vibe.option.detailed.label": "📚 Detailliert",
    "vibe.option.detailed.desc": "Umfassend und gründlich",

    // Features Section
    "features.title1": "Alles, was du brauchst zum",
    "features.title2": "Glänzen",
    "features.feature1": "Intelligente Analyse",
    "features.feature1_desc": "Analysiert dein GitHub-Repo, package.json und Live-Demos, um dein Projekt zu verstehen",
    "features.feature2": "6 einzigartige Vibes",
    "features.feature2_desc": "Professionell, Freundlich, Humorvoll, Kreativ, Minimal oder Detailliert - wähle deinen Stil",
    "features.feature3": "KI-Umschreibungs-Magie",
    "features.feature3_desc": "Nicht zufrieden? Drücke umschreiben und erhalte eine völlig neue Version im gleichen Vibe",
    "features.feature4": "One-Click-Aktionen",
    "features.feature4_desc": "In Zwischenablage kopieren, als .md herunterladen oder inline bearbeiten - was auch immer du brauchst",
    "features.feature5": "Blitzschnell",
    "features.feature5_desc": "Generiere umfassende READMEs in unter 10 Sekunden, nicht in 30 Minuten",
    "features.feature6": "Ständig verbessert",
    "features.feature6_desc": "Regelmäßige Updates, neue Vibes und Funktionen basierend auf Community-Feedback",

    // CTA Section
    "cta.title1": "Bereit, dein",
    "cta.title2": "README Garden zu vergrößern?",
    "cta.description": "Tritt Tausenden von Entwicklern bei, die ihre GitHub-Präsenz transformiert haben. Beginne heute mit schöner Dokumentation.",
    "cta.button": "Jetzt anfangen zu wachsen",
    "cta.tagline": "Keine Kreditkarte erforderlich • Kostenlos für immer • Dauert 10 Sekunden",

    // Footer
    "footer.made_with": "Erstellt mit",
    "footer.by": "von",

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
    "generate.selectVibePlaceholder": "Wähle einen Vibe für deine README",
    "generate.generate": "README generieren",
    "generate.growing": "Deine README wächst...",
    "generate.generating": "Generieren läuft...",
    "generate.copy": "Kopieren",
    "generate.copied": "Kopiert!",
    "generate.download": "Herunterladen",
    "generate.repoUrl": "Repository-URL",
    "generate.repoPlaceholder": "https://github.com/username/repository",
    "generate.liveDemo": "Live-Demo-URL (Optional)",
    "generate.liveDemoPlaceholder": "https://your-live-demo.vercel.app",
    "generate.projectPurpose": "Projektzweck (Optional)",
    "generate.projectPurposePlaceholder": "Beschreibe, was dein Projekt macht...",
    "generate.projectPurposeDescLabel": "Projektzweck / Beschreibung (Optional)",
    "generate.projectPurposeExample": "z. B. Ein Tool zur Erstellung schöner GitHub-READMEs mit KI.",
    "generate.projectPurposeTooltip": "Beschreibe kurz und überzeugend, was dein Projekt macht oder welches Problem es löst.",
    "generate.missingInfo": "Fehlende Informationen",
    "generate.missingInfoDesc": "Bitte gib eine Repository-URL ein und wähle einen Vibe.",
    "generate.limitReached": "Limit erreicht",
    "generate.limitReachedFree": "Du hast alle 5 kostenlosen Einsätze für diese E-Mail + Gerät verwendet.",
    "generate.limitReachedPro": "Du hast alle 5 Pro-Einsätze für heute verwendet.",
    "generate.generationFailed": "Generierung fehlgeschlagen",
    "generate.generationSuccess": "README generiert!",
    "generate.generationSuccessDesc": "Deine schöne README ist bereit!",
    "generate.rewriteFailed": "Umschreibung fehlgeschlagen",
    "generate.rewriteNothing": "Nichts zum Umschreiben",
    "generate.rewriteNothingDesc": "Bitte generiere zuerst eine README.",
    "generate.rewriteSuccess": "README umgeschrieben!",
    "generate.rewriteSuccessDesc": "Deine README wurde vollständig aktualisiert!",
    "generate.preview": "Vorschau",
    "generate.markdown": "Markdown",
    "generate.aiRewrite": "KI-Umschreibung",
    "generate.rewrite": "Umschreiben",
    "generate.usesToday": "Einsätze heute",
    "generate.freeUses": "Kostenlose Einsätze (E-Mail+Gerät)",
    "generate.deviceUses": "Kostenlose Einsätze (Gerät)",
    "generate.goPro": "Pro",
    "generate.wantMore": "Möchtest du 5 Nutzungen pro Tag? Werde Pro",
    "generate.signIn": "Anmelden (5 insgesamt)",
    "generate.growBeautiful": "Wachse mit AI-Magie schöne READMEs",
    "generate.logoutSuccess": "Erfolgreich abgemeldet",
    "generate.logoutSuccessDesc": "Bis bald!",
    "generate.logoutFailed": "Abmeldung fehlgeschlagen",
    "generate.yourReadme": "Deine README",
    "generate.emptyState": "Deine schöne README wird hier erscheinen",

    // Loading Animation
    "loading.title": "Dein README-Garten wächst 🌱",
    "loading.subtitle": "Erstelle deine perfekte README mit KI-Magie ✨",
    "loading.bunny.message": "Häschen hüpft zur Karotte...",
    "loading.bunny.action": "mampf mampf! 😋",
    "loading.bear.message": "Teddybär hat Honig gefunden...",
    "loading.bear.action": "taucht Pfote kichernd ein! 🤭",
    "loading.bee.message": "Bienen summen um die Blumen...",
    "loading.bee.action": "landen mit Glitzerspuren! ✨",
    "loading.cat.message": "Kätzchen jagt das Wollknäuel...",
    "loading.cat.action": "springt vor purer Freude! 😸",
    "loading.turtle.message": "Schildkröte kriecht langsam zum Blatt...",
    "loading.turtle.action": "macht ein gemütliches Nickerchen! 😴",

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