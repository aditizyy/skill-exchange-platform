"use client"

import { useEffect, useMemo, useState } from "react"
import MatchFilterBar from "../components/matches/MatchFilterBar"
import MatchList from "../components/matches/MatchList"
import Loader from "../components/common/Loader"
import { getSuggestedMatches, getSentRequests, sendMatchRequest } from "../api/matchApi"
import { mapUserToDisplayPerson } from "../utils/userDisplay"

export default function Dashboard() {
  const [query, setQuery] = useState("")
  const [people, setPeople] = useState([])
  const [requested, setRequested] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadDashboardData() {
      setLoading(true)
      setError(null)

      try {
        // Fetch suggested matches and sent requests in parallel so we can
        // mark people who already have a pending/accepted request as such.
        const [matchesRes, sentRes] = await Promise.all([
          getSuggestedMatches(),
          getSentRequests(),
        ])

        if (cancelled) return

        const mapped = (matchesRes.matches || []).map(mapUserToDisplayPerson)
        const alreadyRequestedIds = new Set(
          (sentRes.requests || []).map((r) => r.to.id),
        )

        setPeople(mapped)
        setRequested(alreadyRequestedIds)

        if (matchesRes.message) {
          setInfoMessage(matchesRes.message)
        }
      } catch (err) {
        if (cancelled) return
        setError(
          err?.response?.data?.message ||
            "Couldn't load suggested matches. Please try again.",
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboardData()

    return () => {
      cancelled = true
    }
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
  }, [people, query])

  const toggleRequest = async (id) => {
    // Already sent -> nothing to do here (button is disabled once requested)
    if (requested.has(id)) return

    // Optimistically mark as requested so the button updates immediately
    setRequested((prev) => new Set(prev).add(id))

    try {
      await sendMatchRequest(id)
    } catch (err) {
      const status = err?.response?.status

      // 409 = request already exists server-side; treat as success, not an error
      if (status !== 409) {
        // Roll back the optimistic update on real failures
        setRequested((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        setError(
          err?.response?.data?.message ||
            "Couldn't send that request. Please try again.",
        )
      }
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

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {infoMessage && !loading && people.length === 0 && !error && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {infoMessage}
          </div>
        )}

        {/* Matches */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : (
          <MatchList
            filtered={filtered}
            requested={Array.from(requested)}
            toggleRequest={toggleRequest}
          />
        )}

      </div>
    </div>
  )
}
