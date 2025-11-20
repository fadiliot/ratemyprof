// lib/api/professor.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!

export interface Professor {
  id: string
  name: string
  faculty_id: string
  department: string
  courses: string[]
  rating: number
  ratingCount: number
  image: string
}

const mapProfessor = (p: any): Professor => ({
  id: p.id ?? p._id ?? p.faculty_id ?? "",
  name: p.name ?? "",
  faculty_id: p.faculty_id ?? "",
  department: p.department ?? "",
  courses: p.courses ?? [],
  rating: p.rating ?? p.avg_rating ?? 0,
  ratingCount: p.rating_count ?? p.ratingCount ?? 0,
  image: "/professor-avatar.png",
})

export async function fetchProfessors(): Promise<Professor[]> {
  const res = await fetch(`${API_BASE}/professors/professors/`, { cache: "no-store" })
  //                                   ^^^^^^^^^^^^^^^^^^^^^^^
  if (!res.ok) throw new Error("Failed to fetch professors")
  const data = await res.json()
  return data.map(mapProfessor)
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
