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
        initial={{ rotateY: 0 }} // Start with no Y-rotation, no scale animation
        animate={{
          rotateY: [0, 360, 360], // Rotate 360 degrees around Y-axis, then hold
        }}
        transition={{
          duration: 1.5, // Total duration for the icon's animation (matches text end time)
          ease: "easeInOut",
          times: [0, 0.5 / 1.5, 1], // Rotation completes at 0.5s (0.5/1.5 = 1/3 of 1.5s), then holds until 1.5s
        }}
        className="relative"
        onAnimationComplete={onAnimationComplete} // Call parent callback when this animation finishes
      >
        <Github className="w-20 h-20 md:w-24 md:h-24 text-yellow-500 drop-shadow-lg" />{" "}
        {/* Icon size remains constant */}
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
