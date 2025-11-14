"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Star } from "lucide-react"

interface Professor {
  id: number
  name: string
  image: string
}

interface RatingModalProps {
  professor: Professor
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export function RatingModal({ professor, isOpen, onClose, onSubmit }: RatingModalProps) {
  const [ratings, setRatings] = useState({
    clarity: 0,
    communication: 0,
    fairness: 0,
    engagement: 0,
  })
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const criteria = [
    { key: "clarity", label: "Teaching Clarity", description: "How clear are the explanations?" },
    { key: "communication", label: "Communication", description: "How well does the professor communicate?" },
    { key: "fairness", label: "Fairness", description: "How fair are the evaluations?" },
    { key: "engagement", label: "Engagement", description: "How engaging is the class?" },
  ]

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit()
      setRatings({ clarity: 0, communication: 0, fairness: 0, engagement: 0 })
      setFeedback("")
      setIsSubmitting(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-100 dark:border-blue-900 shadow-2xl animate-scale-in">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-800">
          <h2 className="text-2xl font-bold text-primary">Rate {professor.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex items-center gap-4">
            <img
              src={professor.image || "/placeholder.svg"}
              alt={professor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <h3 className="text-lg font-semibold text-primary">{professor.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Share your experience</p>
            </div>
          </div>

          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div key={criterion.key} className="space-y-3">
                <div>
                  <h4 className="font-semibold text-primary mb-1">{criterion.label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{criterion.description}</p>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings({ ...ratings, [criterion.key]: star })}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 transition-all ${
                          star <= ratings[criterion.key as keyof typeof ratings]
                            ? "fill-accent text-accent scale-110"
                            : "text-gray-300 hover:text-accent"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-primary">Additional Feedback (Optional)</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your experience with this professor..."
              className="w-full p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-slate-700 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-lg border-primary text-primary hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold"
              disabled={isSubmitting || Object.values(ratings).some((r) => r === 0)}
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
