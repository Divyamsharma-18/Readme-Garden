"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative z-10 py-8 px-6 bg-gradient-to-t from-background/90 to-transparent backdrop-blur-sm"
    >
<<<<<<< HEAD
      Made with <Heart className="inline-block w-4 h-4 text-red-500 mx-1 animate-pulse" fill="currentColor" /> by&nbsp;
      
      <a
        href="https://divyamsharma.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-primary hover:underline transition-colors"
      >
        Divyam Sharma
      </a>
=======
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-muted-foreground text-sm space-y-4 sm:space-y-0">
        <p>&copy; {new Date().getFullYear()} README Garden. All rights reserved.</p>
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/your-username/readme-garden" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://twitter.com/your-twitter" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </Button>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
>>>>>>> 3cfdf99cba412755336d5912269aaf45a17c9429
    </motion.footer>
  )
}
