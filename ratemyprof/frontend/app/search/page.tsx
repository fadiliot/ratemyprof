"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Search, ArrowLeft } from "lucide-react"

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

export default function SearchPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [professors, setProfessors] = useState<Professor[]>([])
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([])
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const mockProfessors: Professor[] = [
      {
        id: 1,
        name: "Dr. Sharma",
        faculty_id: "SRM001",
        department: "CSE",
        courses: ["DSA", "DBMS"],
        rating: 4.5,
        ratingCount: 234,
        image: "/diverse-professor-lecturing.png",
      },
      {
        id: 2,
        name: "Prof. Patel",
        faculty_id: "SRM002",
        department: "ECE",
        courses: ["Signals", "Systems"],
        rating: 4.2,
        ratingCount: 189,
        image: "/diverse-professor-lecturing.png",
      },
      {
        id: 3,
        name: "Dr. Gupta",
        faculty_id: "SRM003",
        department: "CSE",
        courses: ["Web Dev", "Backend"],
        rating: 4.8,
        ratingCount: 156,
        image: "/diverse-professor-lecturing.png",
      },
      {
        id: 4,
        name: "Prof. Kumar",
        faculty_id: "SRM004",
        department: "Mech",
        courses: ["Thermodynamics"],
        rating: 3.9,
        ratingCount: 112,
        image: "/diverse-professor-lecturing.png",
      },
      {
        id: 5,
        name: "Dr. Iyer",
        faculty_id: "SRM005",
        department: "CSE",
        courses: ["AI/ML", "Deep Learning"],
        rating: 4.6,
        ratingCount: 201,
        image: "/diverse-professor-lecturing.png",
      },
    ]
    setProfessors(mockProfessors)
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <AppHeader userName={user?.name} showProfileLink={true} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-primary">Search Professors</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900 p-6 mb-8 sticky top-24 z-30 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search professors, courses, departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg h-11 border-blue-200 dark:border-blue-800"
                autoFocus
              />
            </div>

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

        <div className="space-y-4">
          {filteredProfessors.length > 0 ? (
            filteredProfessors.map((professor) => (
              <div
                key={professor.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-blue-100 dark:border-blue-900 hover:shadow-lg transition-all flex items-start justify-between animate-fade-in"
              >
                <div className="flex gap-6 flex-1">
                  <img
                    src={professor.image || "/placeholder.svg"}
                    alt={professor.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-blue-100 dark:border-blue-900"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary">{professor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {professor.faculty_id} • {professor.department}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(professor.rating) ? "fill-accent text-accent" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-primary">{professor.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({professor.ratingCount})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {professor.courses.map((course, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-primary text-xs rounded-full font-medium"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href={`/professor/${professor.id}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg">View</Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No professors found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
