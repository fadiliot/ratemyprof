"use client"

import Link from "next/link"
import { Star, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

// Updated interface to match backend stats
interface Professor {
  id: string
  name: string
  faculty_id?: string
  department?: string
  courses: string[]
  image?: string

  avg_rating?: number
  rating_count?: number
}

interface ProfessorCardProps {
  professor: Professor
  onRate: () => void
}

export function ProfessorCard({ professor, onRate }: ProfessorCardProps) {
  const rating = professor.avg_rating ?? 0
  const ratingCount = professor.rating_count ?? 0

  // Generate stars with half-star logic
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <Link href={`/professor/${encodeURIComponent(professor.id)}`}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-blue-900 p-6 hover:shadow-lg transition-all hover:scale-[1.03] cursor-pointer flex flex-col">

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <img
            src={professor.image || "/professor-avatar.png"}
            alt={professor.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-sm transition-transform group-hover:scale-110"
          />
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-primary text-center mb-1">
          {professor.name}
        </h3>

        {/* Department */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          {professor.department || "Department"} • {professor.faculty_id || "Faculty"}
        </p>

        {/* ⭐ Rating Display */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => {
            const isFull = i < fullStars
            const isHalf = i === fullStars && hasHalfStar

            return (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  isFull
                    ? "fill-yellow-400 text-yellow-400"
                    : isHalf
                    ? "fill-yellow-300 text-yellow-300"
                    : "text-gray-300"
                }`}
              />
            )
          })}

          <span className="ml-2 font-bold text-primary">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Rating Count + Course Count */}
        <div className="flex justify-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {ratingCount}
          </span>

          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> {professor.courses.length}
          </span>
        </div>

        {/* Course Tags */}
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

        {/* Rate Button */}
        <Button
          onClick={(e) => {
            e.preventDefault()
            onRate()
          }}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold mt-auto"
        >
          Rate Now
        </Button>
      </div>
    </Link>
  )
}
