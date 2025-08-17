"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Sparkles, ArrowRight, Star, Users, Zap, Palette, Code, Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import Image from "next/image"
import Footer from "@/components/footer"

interface MarketingPageProps {
  onGetStarted: () => void
}

const vibeExamples = [
  {
    vibe: "Professional",
    emoji: "🎯",
    preview:
      "# ProjectName\n\n## Executive Overview\n\nThis enterprise-grade solution delivers exceptional value through innovative technology...",
    color: "from-blue-500 to-indigo-600",
  },
  {
    vibe: "Humorous",
    emoji: "😄",
    preview:
      "# ProjectName 🎭\n*Because regular code is too mainstream*\n\n## What Does This Thing Actually Do? 🤔\n\nGreat question! It does... *checks notes*... amazing things!",
    color: "from-orange-500 to-red-500",
  },
  {
    vibe: "Creative",
    emoji: "🎨",
    preview:
      "# ✨ ProjectName ✨\n*Where Code Meets Art*\n\n🎨 **A Digital Masterpiece** 🎨\n\nCrafted with innovation, this project represents the intersection of technology and creativity...",
    color: "from-purple-500 to-pink-500",
  },
]

export default function MarketingPage({ onGetStarted }: MarketingPageProps) {
  const [mounted, setMounted] = useState(false)
  const [currentVibeIndex, setCurrentVibeIndex] = useState(0)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)

    // Cycle through vibe examples
    const interval = setInterval(() => {
      setCurrentVibeIndex((prev) => (prev + 1) % vibeExamples.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <div className="min-h-screen transition-all duration-700 relative overflow-hidden flex flex-col">
      {/* Dynamic Background - Same as MVP */}
      <div
        className={`fixed inset-0 transition-all duration-700 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
        }`}
      />

      {/* Nature Background Elements - Same as MVP */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {!isDark ? (
          <>
            {/* Sun */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse shadow-2xl"
              style={{ boxShadow: "0 0 50px rgba(251, 191, 36, 0.6)" }}
            />

            {/* Day elements */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute bottom-0 left-10 w-16 h-32"
            >
              <Image
                src="/images/day-tree-1.png"
                alt="Day tree"
                width={64}
                height={128}
                className="object-cover w-full h-full"
              />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              className="absolute bottom-0 right-20 w-20 h-40"
            >
              <Image
                src="/images/day-tree-2.png"
                alt="Day tree"
                width={80}
                height={160}
                className="object-cover w-full h-full"
              />
            </motion.div>

            {/* Flowers */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 + i * 0.3 }}
                className="absolute bottom-10 w-8 h-8 rounded-full overflow-hidden"
                style={{ left: `${30 + i * 20}%` }}
              >
                <Image
                  src="/images/day-flowers.png"
                  alt="Day flowers"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {/* Moon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-16 h-16 bg-gray-200 rounded-full shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(229, 231, 235, 0.8)" }}
            />

            {/* Stars */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${15 + i * 7}%`,
                  top: `${8 + (i % 4) * 12}%`,
                }}
              />
            ))}

            {/* Night elements */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute bottom-0 left-10 w-16 h-32"
            >
              <Image
                src="/images/night-tree-1.png"
                alt="Night tree"
                width={64}
                height={128}
                className="object-cover w-full h-full"
              />
            </motion.div>

            {/* Fireflies */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.4, 0.8],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-lg"
                style={{
                  left: `${25 + i * 12}%`,
                  bottom: `${15 + (i % 3) * 15}%`,
                  boxShadow: "0 0 10px rgba(253, 224, 71, 0.8)",
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shadow-lg">
                  <Github className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    README Garden
                  </h1>
                  <p className="text-lg text-muted-foreground">Where boring docs go to bloom 🌱</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Stop Staring at{" "}
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Blank READMEs
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Turn your GitHub repos from "meh" to "wow" in 30 seconds. Choose your vibe, let AI do the magic.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  30-second generation
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Palette className="w-4 h-4 mr-2" />6 unique vibes
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  10,000+ developers
                </Badge>
              </div>

              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Grow My README
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-sm text-muted-foreground mt-4">
                Free forever • No signup required • 5 generations daily
              </p>
            </motion.div>
          </div>
        </section>

        {/* Vibe Showcase */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Personality
                </span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every project has a personality. Let your README reflect yours with our unique vibe system.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Vibe Selector */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {vibeExamples.map((vibe, index) => (
                  <motion.div
                    key={vibe.vibe}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                      index === currentVibeIndex
                        ? "bg-white/20 dark:bg-gray-800/40 shadow-lg scale-105"
                        : "bg-white/10 dark:bg-gray-800/20 hover:bg-white/15 dark:hover:bg-gray-800/30"
                    }`}
                    onClick={() => setCurrentVibeIndex(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${vibe.color}`}>
                        <span className="text-2xl">{vibe.emoji}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{vibe.vibe}</h4>
                        <p className="text-sm text-muted-foreground">
                          {vibe.vibe === "Professional" && "Clean, corporate, and to-the-point"}
                          {vibe.vibe === "Humorous" && "Professional with jokes and wit"}
                          {vibe.vibe === "Creative" && "Artistic and expressive"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">README Preview</h4>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <motion.div
                      key={currentVibeIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-hidden"
                    >
                      <pre className="whitespace-pre-wrap text-foreground/80">
                        {vibeExamples[currentVibeIndex].preview}
                      </pre>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Shine</span>
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Code className="w-8 h-8" />,
                  title: "Smart Analysis",
                  description: "Analyzes your GitHub repo, package.json, and live demos to understand your project",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: <Palette className="w-8 h-8" />,
                  title: "6 Unique Vibes",
                  description: "Professional, Friendly, Humorous, Creative, Minimal, or Detailed - match your style",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: <RefreshCw className="w-8 h-8" />,
                  title: "AI Rewrite Magic",
                  description: "Not happy? Hit rewrite and get a completely different version in the same vibe",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: <Copy className="w-8 h-8" />,
                  title: "One-Click Actions",
                  description: "Copy to clipboard, download as .md, or edit inline - whatever works for you",
                  color: "from-orange-500 to-red-500",
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Lightning Fast",
                  description: "Generate comprehensive READMEs in under 30 seconds, not 30 minutes",
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  icon: <Star className="w-8 h-8" />,
                  title: "Always Improving",
                  description: "Regular updates, new vibes, and features based on community feedback",
                  color: "from-indigo-500 to-purple-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}>
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <h4 className="font-semibold text-xl mb-3">{feature.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Card className="backdrop-blur-sm bg-gradient-to-r from-green-500/10 to-blue-500/10 border-0 shadow-2xl">
              <CardContent className="p-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Grow Your{" "}
                  <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    README Garden?
                  </span>
                </h3>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who've transformed their GitHub presence. Start growing beautiful
                  documentation today.
                </p>

                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Growing Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-sm text-muted-foreground mt-6">
                  No credit card required • Free forever • Takes 30 seconds
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
