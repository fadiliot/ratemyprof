// lib/api/professor.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export interface Professor {
  id: string
  name: string
  faculty_id: string
  department: string
  courses: string[]
  rating: number
  ratingCount: number
  image: string
  profile_url: string
  avg_teaching_clarity?: number
  avg_communication?: number
  avg_fairness?: number
  avg_engagement?: number
  avg_rating?: number
  rating_count?: number   // ✅ add this
}

// ✅ Map raw backend professor → frontend Professor
const mapProfessor = (p: any): Professor => {
  const mapped: Professor = {
    // Use profile_url as stable ID if no explicit id/_id
    id: p.profile_url ?? p.id ?? p._id ?? p.faculty_id ?? "",
    name: p.name ?? "",
    faculty_id: p.faculty_id ?? "",
    department: p.department ?? "",
    courses: p.courses ?? [],
    rating: p.rating ?? p.avg_rating ?? 0,
    ratingCount: p.rating_count ?? p.ratingCount ?? 0,
    image: "/professor-avatar.png",
    profile_url: p.profile_url ?? "",   // ✅ actually copy it
    avg_teaching_clarity: p.avg_teaching_clarity ?? 0,
  avg_communication: p.avg_communication ?? 0,
  avg_fairness: p.avg_fairness ?? 0,
  avg_engagement: p.avg_engagement ?? 0,
  avg_rating: p.avg_rating ?? 0,
  rating_count: p.rating_count ?? 0
  }

  return mapped
}

export async function fetchProfessors(): Promise<Professor[]> {
  const res = await fetch(`${API_BASE}/professors/professors/`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch professors")

  const data = await res.json()

  // 🔍 Debug: see what backend is returning
  console.log("🔍 Raw professors from backend (first 2):", data.slice?.(0, 2) ?? data)

  const mapped = data.map(mapProfessor)

  // 🔍 Debug: see what we mapped
  console.log("✅ Mapped professors (first 2):", mapped.slice(0, 2))

  return mapped
}

export async function fetchProfessor(id: string): Promise<Professor> {
  const res = await fetch(`${API_BASE}/professors/professors/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch professor")
  return mapProfessor(await res.json())
}

export async function searchProfessorsByName(name: string): Promise<Professor[]> {
  const res = await fetch(
    `${API_BASE}/professors/professors/search/by-name?name=${encodeURIComponent(name)}`,
    { cache: "no-store" },
  )
  if (res.status === 404) return []
  if (!res.ok) throw new Error("Search failed")
  const data = await res.json()
  return data.map(mapProfessor)
}
