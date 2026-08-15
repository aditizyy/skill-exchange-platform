"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle } from "lucide-react"
import MatchFilterBar from "../components/matches/MatchFilterBar"
import MatchList from "../components/matches/MatchList"
import Loader from "../components/common/Loader"
import { getSuggestedMatches, sendMatchRequest, getSentRequests } from "../api/matchApi"
import { getInitials, getAvatarColor } from "../utils/avatar"

// Backend returns { id, name, skillsToTeach, skillsToLearn, matchScore, ... }.
// MatchCard expects { id, name, title, location, initials, avatarColor, teach, learn }.
// This maps one shape to the other without touching MatchCard/MatchList.
function toDisplayPerson(match) {
  const teach = match.skillsToTeach || []
  const learn = match.skillsToLearn || []

  return {
    id: match.id,
    name: match.name,
    title: teach.length > 0 ? teach.slice(0, 2).join(", ") : "Skill Exchange member",
    location: "",
    initials: getInitials(match.name),
    avatarColor: getAvatarColor(match.id || match.name),
    teach,
    learn,
  }
}

export default function Dashboard() {
  const [query, setQuery] = useState("")
  const [requested, setRequested] = useState([])
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true)
      setError("")

      try {
        const [matchesRes, sentRes] = await Promise.all([
          getSuggestedMatches(),
          getSentRequests().catch(() => ({ requests: [] })), // non-fatal if this one fails
        ])

        const matches = (matchesRes.matches || []).map(toDisplayPerson)
        setPeople(matches)

        const alreadyRequestedIds = (sentRes.requests || []).map((r) => r.to.id)
        setRequested(alreadyRequestedIds)
      } catch (err) {
        console.error("Failed to load suggested matches:", err)
        setError("Couldn't load matches right now. Please try again in a moment.")
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return people

    return people.filter((p) => {
      const haystack = [p.name, p.title, ...p.teach, ...p.learn]
        .join(" ")
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [query, people])

  const toggleRequest = async (id) => {
    if (requested.includes(id)) return

    // Optimistic update so the button flips immediately
    setRequested((prev) => [...prev, id])

    try {
      await sendMatchRequest(id)
    } catch (err) {
      console.error("Failed to send request:", err)
      // Roll back on failure so the button doesn't lie about the real state
      setRequested((prev) => prev.filter((x) => x !== id))
    }
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

        {loading ? (
          <Loader className="py-16" />
        ) : error ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 text-center text-sm text-red-600">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        ) : people.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-sm text-slate-500">
              No suggested matches yet. Add skills to your profile to get matched with other members.
            </p>
          </div>
        ) : (
          <MatchList
            filtered={filtered}
            requested={requested}
            toggleRequest={toggleRequest}
          />
        )}

      </div>
    </div>
  )
}
