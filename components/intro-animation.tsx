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
    >
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{
          rotateY: [0, 720, 720],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 1 / 2, 1],
        }}
        className="relative"
        onAnimationComplete={onAnimationComplete}
      >
        <Github className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 drop-shadow-lg" />
      </motion.div>
    </motion.div>
  )
}
