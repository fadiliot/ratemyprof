"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Star } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("➡️ Login Started")
    console.log("Email:", email)
    console.log("Password entered:", password.length > 0)

    if (
      !(email.endsWith("@srmist.edu.in") || email.endsWith("@ktr.srmuniv.edu.in"))
    ) {
      console.log("❌ Invalid email domain")
      alert("Please use your official SRM email (@srmist.edu.in or @ktr.srmuniv.edu.in)")
      setIsLoading(false)
      return
    }

    try {
      console.log("🌐 Sending request to backend...")

      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // VERY IMPORTANT for cookies
        body: JSON.stringify({ email, password }),
      })

      console.log("📥 Response received:", res)
      console.log("Status:", res.status)

      const data = await res.json()
      console.log("📦 Response JSON:", data)

      if (!res.ok) {
        console.log("❌ Backend rejected login:", data.detail)
        alert(data.detail || "Login failed")
        setIsLoading(false)
        return
      }

      console.log("✅ Login success, storing email in localStorage")
      localStorage.setItem("user_email", email)

      console.log("➡️ Attempting redirect to /dashboard")
      router.push("/dashboard")
    } catch (error) {
      console.error("🔥 ERROR during login:", error)
      alert("Unable to connect to backend")
    } finally {
      console.log("⏹ Login finished")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 space-y-6 border border-blue-100 dark:border-blue-900">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Your opinion shapes education</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SRM Email</label>
              <Input
                type="email"
                placeholder="name@srmist.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-blue-200 dark:border-blue-800 h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-blue-200 dark:border-blue-800 h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl font-semibold transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
