"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { ProfessorCard } from "@/components/professor-card"
import { RatingModal } from "@/components/rating-modal"
import { Input } from "@/components/ui/input"
import { Search, ArrowUp } from "lucide-react"

interface Professor {
  id: number
  name: string
  faculty_id: string
  department: string
  courses: string[]
  rating: number
  ratingCount: number
  image: string
  rated?: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [professors, setProfessors] = useState<Professor[]>([])
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    const mockProfessors: Professor[] = [
      {
        id: 1,
        name: "Dr. Sharma",
        faculty_id: "SRM001",
        department: "CSE",
        courses: ["DSA", "DBMS"],
        rating: 4.5,
        ratingCount: 234,
        image: "/professor-avatar.png",
        rated: false,
      },
      {
        id: 2,
        name: "Prof. Patel",
        faculty_id: "SRM002",
        department: "ECE",
        courses: ["Signals", "Systems"],
        rating: 4.2,
        ratingCount: 189,
        image: "/professor-avatar.png",
        rated: true,
      },
      {
        id: 3,
        name: "Dr. Gupta",
        faculty_id: "SRM003",
        department: "CSE",
        courses: ["Web Dev", "Backend"],
        rating: 4.8,
        ratingCount: 156,
        image: "/professor-avatar.png",
        rated: false,
      },
      {
        id: 4,
        name: "Prof. Kumar",
        faculty_id: "SRM004",
        department: "Mech",
        courses: ["Thermodynamics"],
        rating: 3.9,
        ratingCount: 112,
        image: "/professor-avatar.png",
        rated: false,
      },
      {
        id: 5,
        name: "Dr. Iyer",
        faculty_id: "SRM005",
        department: "CSE",
        courses: ["AI/ML", "Deep Learning"],
        rating: 4.6,
        ratingCount: 201,
        image: "/professor-avatar.png",
        rated: true,
      },
      {
        id: 6,
        name: "Prof. Singh",
        faculty_id: "SRM006",
        department: "ECE",
        courses: ["Microprocessors"],
        rating: 4.1,
        ratingCount: 178,
        image: "/professor-avatar.png",
        rated: false,
      },
    ]
    setProfessors(mockProfessors)
    setFilteredProfessors(mockProfessors)
  }, [router])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const filtered = professors.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.courses.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesDept = departmentFilter === "all" || p.department === departmentFilter
      return matchesSearch && matchesDept
    })

    if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.ratingCount - a.ratingCount)
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredProfessors(filtered)
  }, [searchTerm, departmentFilter, sortBy, professors])

  const handleRateClick = (professor: Professor) => {
    setSelectedProfessor(professor)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <AppHeader userName={user?.name} showProfileLink={true} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Rate your professors and help others make informed decisions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search professors or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg h-11 border-blue-200 dark:border-blue-800"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 h-11 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-700 text-sm"
              >
                <option value="all">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Mech">Mechanical</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 h-11 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-700 text-sm"
              >
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Rated</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessors.map((professor) => (
            <ProfessorCard key={professor.id} professor={professor} onRate={() => handleRateClick(professor)} />
          ))}
        </div>

        {filteredProfessors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No professors found</p>
          </div>
        )}
      </div>

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 animate-bounce"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {selectedProfessor && (
        <RatingModal
          professor={selectedProfessor}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProfessor(null)
          }}
          onSubmit={() => {
            setProfessors(professors.map((p) => (p.id === selectedProfessor.id ? { ...p, rated: true } : p)))
            setIsModalOpen(false)
            setSelectedProfessor(null)
          }}
        />
      )}
    </main>
  )
}
