"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Github, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface IntroAnimationProps {
  onAnimationComplete: () => void
}

export default function IntroAnimation({ onAnimationComplete }: IntroAnimationProps) {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 500) // Show text after 0.5s
    const timer2 = setTimeout(() => onAnimationComplete(), 2000) // Complete animation after 2s

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onAnimationComplete])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="fixed inset-0 bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center z-[100]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="p-4 bg-white/20 rounded-3xl shadow-lg backdrop-blur-sm">
            <Github className="w-24 h-24 text-white" />
          </div>
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 text-center"
              >
                <h1 className="text-5xl font-extrabold text-white drop-shadow-lg flex items-center justify-center">
                  README Garden <Sparkles className="w-10 h-10 ml-3 text-yellow-300" />
                </h1>
                <p className="text-xl text-white/90 mt-2">Grow beautiful READMEs with AI magic</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
