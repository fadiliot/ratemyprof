"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { ProfessorCard } from "@/components/professor-card"
import { RatingModal } from "@/components/rating-modal"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

import { useProfessors } from "@/lib/hooks/useProfessors"
import type { Professor } from "@/lib/api/professor"
import { submitRating } from "@/lib/api/ratings"
import type { RatingValues } from "@/components/rating-modal"

export default function DashboardPage() {
  const router = useRouter()

  const [user, setUser] = useState<{ email: string; name: string; department: string } | null>(null)
  const [tab, setTab] = useState<"all" | "mine">("all")

  const [professors, setProfessors] = useState<Professor[]>([])
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: apiProfessors, loading, error } = useProfessors()

  // 🔥 Load login state using cookie-based /auth/me
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        })

        if (!res.ok) {
          router.push("/login")
          return
        }

        const data = await res.json() // { email: "..." }
        const email: string = data.email
        const name = email.split("@")[0]
        const userDept = "CSE" // TODO: fetch from backend later

        setUser({
          email,
          name,
          department: userDept,
        })
      } catch (err) {
        console.error("Error checking auth:", err)
        router.push("/login")
      }
    }

    fetchUser()
  }, [router])

  // When API data arrives, sync into local professors state
  useEffect(() => {
    if (apiProfessors) {
      setProfessors(apiProfessors)
      setFilteredProfessors(apiProfessors)
    }
  }, [apiProfessors])

  // 🔍 Log whenever selectedProfessor changes
  useEffect(() => {
    if (selectedProfessor) {
      console.log("✅ selectedProfessor set:", selectedProfessor)
      console.log("✅ selectedProfessor.id:", selectedProfessor.id)
      console.log("✅ selectedProfessor.profile_url:", selectedProfessor.profile_url)
    } else {
      console.log("ℹ️ selectedProfessor cleared")
    }
  }, [selectedProfessor])

  // 🔥 Filter and sort
  useEffect(() => {
    let list = [...professors]

    if (tab === "mine" && user) {
      list = list.filter((p) => p.department === user.department)
    }

    list = list.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.courses.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesDept = departmentFilter === "all" || p.department === departmentFilter

      return matchesSearch && matchesDept
    })

    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating)
    else if (sortBy === "popular") list.sort((a, b) => b.ratingCount - a.ratingCount)
    else list.sort((a, b) => a.name.localeCompare(b.name))

    setFilteredProfessors(list)
  }, [tab, searchTerm, departmentFilter, sortBy, professors, user])

  // ⭐ Submit rating to backend
    const handleSubmitRating = async (values: RatingValues) => {
    if (!selectedProfessor) return

    const profileUrl = selectedProfessor.profile_url || selectedProfessor.id

    console.log("🔹 [submit] Selected professor object:", selectedProfessor)
    console.log("🔹 [submit] Sending professor_name:", selectedProfessor.name)
    console.log("🔹 [submit] Sending professor_profile_url:", profileUrl)

    try {
      await submitRating({
        professor_name: selectedProfessor.name,
        professor_profile_url: profileUrl,
        teaching_clarity: values.teaching_clarity,
        communication: values.communication,
        fairness: values.fairness,
        engagement: values.engagement,
        comment: values.comment,
      })

      alert("Rating submitted!")
    } catch (err: any) {
      if (err.message === "unauthorized") {
        router.push("/login")
        return
      }

      console.error("Error submitting rating:", err)
      alert(err.message || "Failed to submit rating")
      throw err
    }
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <AppHeader userName={user?.name} showProfileLink={true} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* TITLE */}
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welcome, {user?.name ?? "Student"} 👋
        </h1>

        {/* 🔥 TAB SWITCH */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              tab === "all" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setTab("all")}
          >
            All Professors
          </button>

          <button
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              tab === "mine" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setTab("mine")}
          >
            My Professors
          </button>
        </div>

        {/* 🔍 Search + Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search professors or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg h-11"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 h-11 rounded-lg border bg-white dark:bg-slate-700"
              >
                <option value="all">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Mech">Mechanical</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 h-11 rounded-lg border bg-white dark:bg-slate-700"
              >
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Rated</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            Loading professors...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessors.map((prof) => (
                <ProfessorCard
                  key={prof.id}
                  professor={prof}
                  onRate={() => {
                    console.log("🟢 Rate clicked for professor:", prof)
                    console.log("🟢 prof.id (profile_url) being set as selectedProfessor.id:", prof.id)
                    setSelectedProfessor(prof)
                    setIsModalOpen(true)
                  }}
                />
              ))}
            </div>

            {filteredProfessors.length === 0 && (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                No professors found
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {selectedProfessor && (
        <RatingModal
          professor={selectedProfessor}
          isOpen={isModalOpen}
          onClose={() => {
            console.log("🔻 Closing modal, clearing selectedProfessor")
            setIsModalOpen(false)
            setSelectedProfessor(null)
          }}
          onSubmit={handleSubmitRating}
        />
      )}
    </main>
  )
}
