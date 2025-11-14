"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Users, TrendingUp } from "lucide-react"
import { AppHeader } from "@/components/app-header"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <AppHeader />

      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">Your Opinion Shapes Education</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Rate professors at SRM University. Share your experiences, help fellow students make informed decisions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg">
              Get Started
            </Button>
          </Link>
          <Link href="/search">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent"
            >
              Browse Professors
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Users, title: "Community Driven", desc: "Authentic reviews from SRM students" },
            { icon: Star, title: "Fair Ratings", desc: "Rate on multiple criteria for accuracy" },
            { icon: TrendingUp, title: "Transparent Data", desc: "Real insights to help you choose" },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900 shadow-sm hover:shadow-md transition-all"
            >
              <feature.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-lg text-primary">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
