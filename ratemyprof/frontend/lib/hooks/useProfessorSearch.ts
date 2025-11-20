// lib/hooks/useProfessorSearch.ts
"use client"

import { useEffect, useState } from "react"
import { searchProfessorsByName } from "@/lib/api/professor"
import type { Professor } from "@/lib/api/professor"

export function useProfessorSearch(name: string) {
  const [data, setData] = useState<Professor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const trimmed = name.trim()

    // If no search term, reset results and don't call backend
    if (!trimmed) {
      setData([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    searchProfessorsByName(trimmed)
      .then((profs) => {
        setData(profs)
        setLoading(false)
      })
      .catch((err: any) => {
        if (err.name === "AbortError") return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [name])

  return { data, loading, error }
}
