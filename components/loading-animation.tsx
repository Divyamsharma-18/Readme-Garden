"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

interface LoadingAnimationProps {
  isLoading: boolean
  onAnimationComplete: () => void
}

export default function LoadingAnimation({ isLoading, onAnimationComplete }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startProgressSimulation = useCallback(() => {
    setProgress(0)
    setIsVisible(true)
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 95) {
          return prevProgress + 0.5 // Smaller, consistent increment for smoother animation
        }
        return prevProgress
      })
    }, 50) // Faster update interval for smoother animation
  }, [])

  const completeProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    setProgress(100)

    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current)
    }
    completionTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
      onAnimationComplete()
    }, 500) // Stay visible for 0.5 seconds after reaching 100%
  }, [onAnimationComplete])

  useEffect(() => {
    if (isLoading) {
      startProgressSimulation()
    } else {
      if (isVisible) {
        completeProgress()
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current)
      }
    }
  }, [isLoading, startProgressSimulation, completeProgress, isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 dark:bg-gray-900/90 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center"
          >
            <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-6 animate-pulse" />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              {isLoading ? "Growing Your README..." : "README Ready!"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {isLoading ? "Please wait while AI magic is at work." : "Your README is complete!"}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }} // Smooth transition for each step
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
