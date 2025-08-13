"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface UserProfileProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  onOpenAuthModal: () => void
}

export default function UserProfile({ user, onOpenAuthModal }: UserProfileProps) {
  const { toast } = useToast()

  const handleMyProfileClick = () => {
    if (user) {
      toast({
        title: "Profile Management",
        description:
          'This feature is under development. For now, clicking "My Profile" will open the authentication modal.',
      })
    }
    onOpenAuthModal()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || "/placeholder-user.jpg"} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name ? user.name[0] : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Guest"}</p>
            {user?.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleMyProfileClick}>My Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
