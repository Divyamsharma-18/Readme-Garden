"use client"

import { motion } from "framer-motion"
import { Github } from "lucide-react"

interface IntroAnimationProps {
  onAnimationComplete: () => void
}

export default function IntroAnimation({ onAnimationComplete }: IntroAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }} // Overall fade-in/out of the overlay
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900"
    >
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: [0, 1, 1.2], // Scale from 0 to 1 (normal size), then to 1.2 (zoom in)
          rotate: [0, 360, 360], // Rotate 360 degrees, then hold
        }}
        transition={{
          duration: 1.5, // Total duration for icon animation
          ease: "easeInOut",
          times: [0, 1 / 1.5, 1], // 0s, 1s (0.666 of 1.5s), 1.5s
        }}
        className="relative"
        onAnimationComplete={onAnimationComplete} // Call parent callback when this animation finishes
      >
        <Github className="w-32 h-32 md:w-48 md:h-48 text-yellow-500 drop-shadow-lg" />
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Start below and invisible
          animate={{ opacity: 1, y: 0 }} // Move up and fade in
          transition={{
            delay: 1.25, // Start at 1.25 seconds
            duration: 0.25, // Finish by 1.5 seconds
            ease: "easeOut",
          }}
          className="absolute inset-x-0 bottom-[-40px] flex items-center justify-center" // Position below the icon
        >
          <motion.span
            className="text-2xl md:text-3xl font-bold text-white text-shadow-md"
            style={{ textShadow: "0px 0px 8px rgba(0,0,0,0.5)" }}
          >
            README Garden
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
