"use client"

import { motion } from "framer-motion"
import { Heart, Github, Twitter } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full py-4 px-4 sm:px-6 lg:px-8 gap-0.5 flex flex-col sm:flex-row justify-center items-center
                 bg-white/10 dark:bg-black/10 backdrop-blur-lg shadow-lg
                 text-center text-sm text-foreground/80"
    >
      <div className="flex items-center justify-center">
        {t("footer.made_with")}{" "}
        <Heart
          className="inline-block w-4 h-4 text-red-500 mx-1 animate-pulse relative top-[0.4px]"
          fill="currentColor"
        />
        {t("footer.by")}&nbsp;
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-1 sm:mt-0">
        <a
          href="https://divyamsharma.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary hover:underline transition-colors"
        >
          Divyam Sharma
        </a>
        <span className="inline-flex items-center gap-0.5">
          <a
            href="https://x.com/Heydivyamsharma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X profile"
            className="inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
            title="X"
          >
            <Twitter className="w-4 h-4 relative top-[1.2px]" />
          </a>
          <a
            href="https://github.com/Divyamsharma-18"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4 relative top-[2px]" />
          </a>
        </span>
      </div>
    </motion.footer>
  )
}
