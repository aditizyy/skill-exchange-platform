"use client"

import { useMemo, useState } from "react"
import MatchFilterBar from "../components/matches/MatchFilterBar"
import MatchList from "../components/matches/MatchList"

const PEOPLE = [
  {
    id: 1,
    name: "Aditi",
    title: "Product Designer",
    location: "Sarojini nagar, Delhi",
    initials: "A",
    avatarColor: "bg-blue-600",
    teach: ["UI/UX Design", "Figma", "Illustration"],
    learn: ["React", "TypeScript"],
  },
  {
    id: 2,
    name: "Kashika Soni",
    title: "Frontend Engineer",
    location: "Rohini, Delhi",
    initials: "KS",
    avatarColor: "bg-indigo-600",
    teach: ["React", "TypeScript", "Node.js"],
    learn: ["UI/UX Design", "Public Speaking"],
  },
  {
    id: 3,
    name: "Disha Kushwaha",
    title: "Marketing Lead",
    location: "Agra, UP",
    initials: "DK",
    avatarColor: "bg-sky-600",
    teach: ["Digital Marketing", "SEO", "Writing"],
    learn: ["Data Analysis", "Excel"],
  },
  {
    id: 4,
    name: "Aastha Singh",
    title: "Data Scientist",
    location: "Banaras, UP",
    initials: "AS",
    avatarColor: "bg-cyan-700",
    teach: ["Python", "Machine Learning", "Data Analysis"],
    learn: ["Guitar", "Spanish"],
  },
  {
    id: 5,
    name: "Vriti",
    title: "Language Tutor",
    location: "Chanakyapuri, Delhi",
    initials: "V",
    avatarColor: "bg-blue-500",
    teach: ["Spanish", "French", "Public Speaking"],
    learn: ["Photography", "Video Editing"],
  },
]

export default function Dashboard() {
  const [query, setQuery] = useState("")
  const [requested, setRequested] = useState([])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return PEOPLE

    return PEOPLE.filter((p) => {
      const haystack = [p.name, p.title, ...p.teach, ...p.learn]
        .join(" ")
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [query])

  const toggleRequest = (id) => {
    setRequested((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id],
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600">
            Skill Exchange
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Suggested Skill Matches
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            People whose skills align with what you want to learn and teach.
          </p>
        </div>

        {/* Search + Filter */}
        <MatchFilterBar
          query={query}
          setQuery={setQuery}
        />

        {/* Matches */}
        <MatchList
          filtered={filtered}
          requested={requested}
          toggleRequest={toggleRequest}
        />

      </div>
    </div>
  )
}