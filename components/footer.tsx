"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full py-4 px-4 sm:px-6 lg:px-8 flex justify-center items-center
                 bg-white/10 dark:bg-black/10 backdrop-blur-lg border-t border-white/20 dark:border-gray-700 shadow-lg
                 text-center text-sm text-foreground/80"
    >
      Made with <Heart className="inline-block w-4 h-4 text-red-500 mx-1 animate-pulse" fill="currentColor" /> by{" "}
      
      <a
        href="https://divyamsharma.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-primary hover:underline transition-colors"
      >
        Divyam Sharma
      </a>
    </motion.footer>
  )
}
