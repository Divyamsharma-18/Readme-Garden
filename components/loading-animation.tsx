"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const animations = [
  {
    id: "bunny",
    emoji: "🐰",
    target: "🥕",
    message: "Bunny is hopping to the carrot...",
    action: "munch munch! 😋",
  },
  {
    id: "bear",
    emoji: "🧸",
    target: "🍯",
    message: "Teddy bear found some honey...",
    action: "dipping paw with giggles! 🤭",
  },
  {
    id: "bee",
    emoji: "🐝",
    target: "🌼",
    message: "Bees are buzzing around flowers...",
    action: "landing with sparkly trails! ✨",
  },
  {
    id: "cat",
    emoji: "🐱",
    target: "🧶",
    message: "Kitty is chasing the yarn ball...",
    action: "pouncing with pure joy! 😸",
  },
  {
    id: "turtle",
    emoji: "🐢",
    target: "🥬",
    message: "Turtle is slowly walking to the leaf...",
    action: "curling up for a cozy nap! 😴",
  },
]

export default function LoadingAnimation() {
  const [currentAnimation, setCurrentAnimation] = useState(0)
  const [showSparkles, setShowSparkles] = useState(false)
  const [showAction, setShowAction] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length)
      setShowAction(false)
    }, 4000)

    const sparkleInterval = setInterval(() => {
      setShowSparkles((prev) => !prev)
    }, 800)

    const actionInterval = setInterval(() => {
      setShowAction(true)
      setTimeout(() => setShowAction(false), 2000)
    }, 4000)

    return () => {
      clearInterval(interval)
      clearInterval(sparkleInterval)
      clearInterval(actionInterval)
    }
  }, [])

  const current = animations[currentAnimation]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden border-2 border-green-200 dark:border-green-800"
      >
        {/* Sparkles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {showSparkles && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                  }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <div className="w-3 h-3 text-yellow-400">✨</div>
                </motion.div>
              ))}
            </>
          )}
        </div>

        <div className="relative z-10">
          <motion.h3
            key={current.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            Growing Your README Garden 🌱
          </motion.h3>

          <div className="flex items-center justify-center space-x-6 mb-6">
            {/* Animated Character */}
            <motion.div
              key={`${current.id}-character`}
              initial={{ x: -60, opacity: 0, rotate: -10 }}
              animate={{
                x: showAction ? -10 : 0,
                opacity: 1,
                rotate: showAction ? 10 : 0,
                scale: showAction ? 1.1 : 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl"
            >
              {current.emoji}
            </motion.div>

            {/* Moving dots */}
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                />
              ))}
            </div>

            {/* Target */}
            <motion.div
              key={`${current.id}-target`}
              initial={{ x: 60, opacity: 0, rotate: 10 }}
              animate={{
                x: showAction ? 10 : 0,
                opacity: 1,
                rotate: showAction ? -10 : 0,
                scale: showAction ? 1.2 : 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-5xl"
            >
              {current.target}
            </motion.div>
          </div>

          <motion.p
            key={current.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground mb-2 text-sm"
          >
            {current.message}
          </motion.p>

          <AnimatePresence>
            {showAction && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-green-600 dark:text-green-400 font-medium text-sm mb-4"
              >
                {current.action}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="h-3 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 20, ease: "linear" }}
            />
          </div>

          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-sm text-muted-foreground"
          >
            Crafting your perfect README with AI magic ✨
          </motion.p>

          {/* Floating hearts */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  delay: i * 1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
                className="absolute text-pink-400 text-lg"
                style={{
                  left: `${30 + i * 20}%`,
                  bottom: "20%",
                }}
              >
                💖
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
