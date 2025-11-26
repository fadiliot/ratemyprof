// lib/api/ratings.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function submitRating(payload: {
  professor_name: string
  professor_profile_url: string
  teaching_clarity: number
  communication: number
  fairness: number
  engagement: number
  comment?: string
}) {
  const res = await fetch(`${API_BASE}/ratings/ratings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // important so the access_token cookie is sent
    body: JSON.stringify(payload),
  })

  if (res.status === 401) {
    throw new Error("unauthorized")
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || "Not Found")
  }

  return res.json()
}
