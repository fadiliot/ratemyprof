"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Star, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

interface AppHeaderProps {
  userName?: string
  showProfileLink?: boolean
}

export function AppHeader({ userName, showProfileLink = true }: AppHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthPage = pathname === "/login" || pathname === "/signup"

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={userName ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Star className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-primary hidden sm:inline">RateMyProf SRM</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthPage && userName && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {userName}</span>
              {showProfileLink && (
                <Link href="/profile">
                  <Button variant="ghost" className="text-primary hover:bg-blue-50 dark:hover:bg-blue-950">
                    My Profile
                  </Button>
                </Link>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
          {isAuthPage && (
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && !isAuthPage && userName && (
        <div className="md:hidden border-t border-blue-100 dark:border-blue-900 p-4 space-y-2">
          <span className="block text-sm text-gray-600 dark:text-gray-400 px-2">Welcome, {userName}</span>
          {showProfileLink && (
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-primary">
                My Profile
              </Button>
            </Link>
          )}
          <Button
            onClick={() => {
              handleLogout()
              setMobileMenuOpen(false)
            }}
            variant="outline"
            className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
    </nav>
  )
}
