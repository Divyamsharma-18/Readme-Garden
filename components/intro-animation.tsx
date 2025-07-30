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
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900"
      onAnimationComplete={() => {
        // This ensures the component stays visible for a set duration before fading out
        setTimeout(onAnimationComplete, 2000) // Stay visible for 2 seconds after initial animation
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: [0, 1.2, 1], rotate: 360 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1.5,
        }}
        className="relative"
      >
        <Github className="w-32 h-32 md:w-48 md:h-48 text-yellow-500 drop-shadow-lg" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
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
