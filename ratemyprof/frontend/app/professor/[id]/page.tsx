"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, ArrowLeft, BookOpen, Users, Zap } from "lucide-react"
import { RatingModal } from "@/components/rating-modal"

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

export default function ProfessorDetail({ params }: { params: { id: string } }) {
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
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
    ]
    const prof = mockProfessors.find((p) => p.id === Number.parseInt(params.id))
    setProfessor(prof || null)
  }, [params.id])

  if (!professor) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <nav className="sticky top-0 z-40 border-b border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-primary">{professor.name}</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 rounded-3xl p-12 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={professor.image || "/placeholder.svg"}
              alt={professor.name}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-primary shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-primary mb-2">{professor.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Faculty ID: {professor.faculty_id}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="font-medium">{professor.department}</span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">{professor.ratingCount} ratings</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.floor(professor.rating) ? "fill-accent text-accent" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-3xl font-bold text-primary">{professor.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-blue-100 dark:border-blue-900">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Courses Taught
            </h3>
            <div className="space-y-2">
              {professor.courses.map((course, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-slate-700 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="font-medium">{course}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-blue-100 dark:border-blue-900">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Rating Status
            </h3>
            <div className="space-y-4">
              {professor.rated ? (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-green-700 dark:text-green-300 font-medium">✓ You have rated this professor</p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-300 font-medium">You haven't rated this professor yet</p>
                </div>
              )}
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-lg font-semibold"
                disabled={professor.rated}
              >
                {professor.rated ? "Already Rated" : "Rate Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {professor && (
        <RatingModal
          professor={professor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => {
            setProfessor({ ...professor, rated: true })
            setIsModalOpen(false)
          }}
        />
      )}
    </main>
  )
}
