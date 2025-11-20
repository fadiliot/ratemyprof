// lib/hooks/useProfessors.ts
"use client"

import { useEffect, useState } from "react"
import { fetchProfessors } from "@/lib/api/professor"
import type { Professor } from "@/lib/api/professor"

export function useProfessors() {
  const [data, setData] = useState<Professor[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    fetchProfessors()
      .then((profs) => {
        if (mounted) {
          setData(profs)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { data, loading, error }
}
