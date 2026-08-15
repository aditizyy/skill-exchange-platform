"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock, AlertCircle } from "lucide-react"

import RequestCard from "../components/inbox/RequestCard"
import RequestTabs from "../components/inbox/RequestTabs"
import Loader from "../components/common/Loader"
import { getInboxRequests, respondToRequest } from "../api/matchApi"
import { getInitials, getAvatarColor } from "../utils/avatar"

// Backend returns { id, status, from: { id, name, skillsToTeach, skillsToLearn, email? } }.
// RequestCard expects { id, name, title, initials, avatarColor, teach, learn, status, email? }.
function toDisplayRequest(req) {
  const from = req.from || {}
  const teach = from.skillsToTeach || []
  const learn = from.skillsToLearn || []

  return {
    id: req.id,
    name: from.name,
    title: teach.length > 0 ? teach.slice(0, 2).join(", ") : "Skill Exchange member",
    initials: getInitials(from.name),
    avatarColor: getAvatarColor(from.id || from.name),
    teach,
    learn,
    status: req.status,
    email: from.email, // only present once status === "accepted", backend enforces this
  }
}

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
]

export default function Inbox() {
  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadInbox = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await getInboxRequests()
        setRequests((response.requests || []).map(toDisplayRequest))
      } catch (err) {
        console.error("Failed to load inbox:", err)
        setError("Couldn't load your inbox right now. Please try again in a moment.")
      } finally {
        setLoading(false)
      }
    }

    loadInbox()
  }, [])

  const counts = useMemo(() => {
    return requests.reduce(
      (acc, r) => {
        acc[r.status] += 1
        return acc
      },
      { pending: 0, accepted: 0, declined: 0 },
    )
  }, [requests])

  const visible = useMemo(
    () => requests.filter((r) => r.status === activeTab),
    [requests, activeTab],
  )

  const updateStatus = async (id, status) => {
    try {
      const response = await respondToRequest(id, status)
      const updated = response.request

      // Merge in whatever the backend actually returns (e.g. email once accepted)
      // rather than assuming the local optimistic state is correct.
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? toDisplayRequest({ id, status: updated.status, from: updated.from })
            : r,
        ),
      )
    } catch (err) {
      console.error("Failed to update request:", err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Inbox
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your skill exchange requests.
          </p>
        </div>

        {/* Tabs */}
        <RequestTabs
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
        />

        {loading ? (
          <Loader className="py-16" />
        ) : error ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 text-center text-sm text-red-600">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Clock className="mx-auto mb-3 h-8 w-8 text-slate-300" />

            <p className="text-sm text-slate-500">
              No {activeTab} requests right now.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                updateStatus={updateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
