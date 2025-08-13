"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, LogOut, Settings, History, Star, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface UserProfileProps {
  username: string
  email: string
  onLogout: () => void
  onOpenAuthModal: () => void // New prop for opening auth modal
}

export default function UserProfile({ username, email, onLogout, onOpenAuthModal }: UserProfileProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    })
  }

  const handleMyProfileClick = () => {
    onOpenAuthModal() // Call the function to open the auth modal
    toast({
      title: "Profile Management",
      description: "For account management or switching users, please use the sign-in/sign-up modal.",
      variant: "default",
    })
  }

  const firstInitial = username && username.length > 0 ? username.charAt(0).toUpperCase() : "U"

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-2 rounded-full p-1 pl-3 pr-2 hover:bg-muted">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`} alt={username} />
            <AvatarFallback>{firstInitial}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline-block">{username}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{username}</p>
              <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleMyProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <History className="mr-2 h-4 w-4" />
            <span>My READMEs</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Star className="mr-2 h-4 w-4" />
            <span>Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
