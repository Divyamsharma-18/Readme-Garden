"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const animations = [
  {
    id: "bunny",
    emoji: "🐰",
    target: "🥕",
    message: "Bunny is hopping to the carrot...",
  },
  {
    id: "bear",
    emoji: "🧸",
    target: "🍯",
    message: "Teddy bear found some honey...",
  },
  {
    id: "bee",
    emoji: "🐝",
    target: "🌼",
    message: "Bees are buzzing around flowers...",
  },
  {
    id: "cat",
    emoji: "🐱",
    target: "🧶",
    message: "Kitty is chasing the yarn ball...",
  },
  {
    id: "turtle",
    emoji: "🐢",
    target: "🥬",
    message: "Turtle is slowly walking to the leaf...",
  },
]

export default function LoadingAnimation() {
  const [currentAnimation, setCurrentAnimation] = useState(0)
  const [showSparkles, setShowSparkles] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length)
    }, 3000)

    const sparkleInterval = setInterval(() => {
      setShowSparkles((prev) => !prev)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(sparkleInterval)
    }
  }, [])

  const current = animations[currentAnimation]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden"
      >
        {/* Sparkles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {showSparkles && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Growing Your README Garden 🌱
          </h3>

          <div className="flex items-center justify-center space-x-8 mb-6">
            {/* Animated Character */}
            <motion.div
              key={`${current.id}-character`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl"
            >
              {current.emoji}
            </motion.div>

            {/* Moving dots */}
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
              ))}
            </div>

            {/* Target */}
            <motion.div
              key={`${current.id}-target`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-4xl"
            >
              {current.target}
            </motion.div>
          </div>

          <motion.p
            key={current.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground mb-4"
          >
            {current.message}
          </motion.p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 15, ease: "linear" }}
            />
          </div>

          <p className="text-sm text-muted-foreground">Crafting your perfect README with AI magic ✨</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
