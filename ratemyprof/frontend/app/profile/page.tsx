"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Star, ArrowLeft, Award } from "lucide-react"

interface User {
  email: string
  name: string
}

interface RatedProfessor {
  id: number
  name: string
  rating: number
  ratedAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [ratedProfessors, setRatedProfessors] = useState<RatedProfessor[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    const mockRated = [
      { id: 1, name: "Dr. Sharma", rating: 5, ratedAt: "2024-11-05" },
      { id: 3, name: "Dr. Gupta", rating: 4, ratedAt: "2024-11-01" },
      { id: 5, name: "Dr. Iyer", rating: 5, ratedAt: "2024-10-28" },
    ]
    setRatedProfessors(mockRated)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <AppHeader userName={user?.name} showProfileLink={false} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 rounded-3xl p-8 mb-8">
          <div className="flex items-end gap-6">
            <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-primary mb-2">{user?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{ratedProfessors.length} Professors Rated</span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg">
                  <Star className="w-5 h-5 text-accent" />
                  <span className="font-semibold">
                    {ratedProfessors.length > 0
                      ? (ratedProfessors.reduce((a, b) => a + b.rating, 0) / ratedProfessors.length).toFixed(1)
                      : 0}
                    Ø Avg Rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900 p-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Professors You've Rated</h2>
          {ratedProfessors.length > 0 ? (
            <div className="space-y-4">
              {ratedProfessors.map((prof) => (
                <div
                  key={prof.id}
                  className="flex items-center justify-between p-4 bg-blue-50 dark:bg-slate-700 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">{prof.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rated on {new Date(prof.ratedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < prof.rating ? "fill-accent text-accent" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">You haven't rated any professors yet</p>
          )}
        </div>

        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white h-12 rounded-lg font-semibold flex items-center justify-center gap-2 mt-8"
        >
          Logout
        </Button>
      </div>
    </main>
  )
}
