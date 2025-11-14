"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, BookOpen, Users } from "lucide-react"

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

interface ProfessorCardProps {
  professor: Professor
  onRate: () => void
}

export function ProfessorCard({ professor, onRate }: ProfessorCardProps) {
  return (
    <Link href={`/professor/${professor.id}`}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900 p-6 hover:shadow-lg transition-all hover:scale-105 group cursor-pointer h-full flex flex-col">
        <div className="mb-4">
          <img
            src={professor.image || "/placeholder.svg"}
            alt={professor.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-primary mx-auto group-hover:scale-110 transition-transform"
          />
        </div>

        <h3 className="text-lg font-bold text-primary text-center mb-1">{professor.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          {professor.faculty_id} • {professor.department}
        </p>

        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 transition-all ${i < Math.floor(professor.rating) ? "fill-accent text-accent" : "text-gray-300"}`}
            />
          ))}
          <span className="ml-2 font-bold text-primary">{professor.rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {professor.ratingCount}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {professor.courses.length}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {professor.courses.slice(0, 2).map((course, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-primary text-xs rounded-full font-medium"
            >
              {course}
            </span>
          ))}
          {professor.courses.length > 2 && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-primary text-xs rounded-full font-medium">
              +{professor.courses.length - 2}
            </span>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault()
            onRate()
          }}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold mt-auto"
          disabled={professor.rated}
        >
          {professor.rated ? "✓ Rated" : "Rate Now"}
        </Button>
      </div>
    </Link>
  )
}
