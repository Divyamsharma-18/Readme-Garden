"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Sparkles, ArrowRight, Star, Users, Zap, Palette, Code, Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
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

const handleStarOnGitHub = () => {
  window.open("https://github.com/Divyamsharma-18/Readme-Garden", "_blank")
}

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
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black" />

      {/* Simple grid pattern overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
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
                <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg">
                  <Github className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-3xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                    README Garden
                  </h1>
                  <p className="text-lg text-purple-300">Where boring docs go to bloom 🌱</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Stop Staring at{" "}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Blank READMEs
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                Turn your GitHub repos from "meh" to "wow" in 30 seconds. Choose your vibe, let AI do the magic.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-purple-900/50 text-purple-200 border-purple-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  30-second generation
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-purple-900/50 text-purple-200 border-purple-700"
                >
                  <Palette className="w-4 h-4 mr-2" />6 unique vibes
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm bg-purple-900/50 text-purple-200 border-purple-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  10,000+ developers
                </Badge>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-4 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 text-sm sm:text-lg border border-purple-500/50 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="whitespace-nowrap text-white">Grow My README</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              </motion.div>

              <p className="text-sm text-purple-300 mt-4">Free forever • No signup required • 5 generations daily</p>
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
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Personality
                </span>
              </h3>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto">
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
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                      index === currentVibeIndex
                        ? "bg-purple-900/40 border-purple-500/50 shadow-lg shadow-purple-500/20 scale-105"
                        : "bg-black/20 border-purple-800/30 hover:bg-purple-900/20 hover:border-purple-600/40"
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
                        <h4 className="font-semibold text-lg text-white">{vibe.vibe}</h4>
                        <p className="text-sm text-purple-300">
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
                <Card className="bg-black/40 border-purple-800/50 shadow-2xl shadow-purple-500/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg text-white">README Preview</h4>
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
                      className="bg-gray-900/80 border border-purple-800/30 rounded-lg p-4 font-mono text-sm overflow-hidden"
                    >
                      <pre className="whitespace-pre-wrap text-purple-100">
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
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Shine
                </span>
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
                  <Card className="bg-black/40 border-purple-800/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 h-full hover:border-purple-600/60">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}>
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <h4 className="font-semibold text-xl mb-3 text-white">{feature.title}</h4>
                      <p className="text-purple-200 leading-relaxed">{feature.description}</p>
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
            <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <CardContent className="p-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Ready to Grow Your{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    README Garden?
                  </span>
                </h3>
                <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who've transformed their GitHub presence. Start growing beautiful
                  documentation today.
                </p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onGetStarted}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-3  sm:px-12 py-3 sm:py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 text-sm sm:text-lg border border-purple-500/50 w-full sm:w-auto max-w-[280px] sm:max-w-none mx-auto flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="whitespace-nowrap text-xs sm:text-lg">Start Growing Now</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  </Button>
                </motion.div>

                <p className="text-sm text-purple-300 mt-6">
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
