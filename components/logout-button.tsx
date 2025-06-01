'use client'

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/app/(auth)/admin/action/auth"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Button 
      onClick={handleLogout}
      variant="outline" 
      size="sm" 
      className="gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}
