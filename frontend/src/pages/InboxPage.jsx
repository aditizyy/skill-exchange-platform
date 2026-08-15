"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock } from "lucide-react"

import RequestCard from "../components/inbox/RequestCard"
import RequestTabs from "../components/inbox/RequestTabs"
import ChatWindow from "../components/messages/ChatWindow"
import Loader from "../components/common/Loader"
import { getInboxRequests, respondToRequest } from "../api/matchApi"
import { mapUserToDisplayPerson } from "../utils/userDisplay"

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
]

// Merges the Request document (id, status) with the display shape derived
// from the requester's user profile (name, initials, teach/learn, etc).
function mapRequestToCardData(request) {
  return {
    ...mapUserToDisplayPerson(request.from),
    id: request.id,
    userId: request.from.id,
    status: request.status,
  }
}

export default function Inbox() {
  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [chatPerson, setChatPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadInbox() {
      setLoading(true)
      setError(null)

      try {
        const res = await getInboxRequests()
        if (cancelled) return
        setRequests((res.requests || []).map(mapRequestToCardData))
      } catch (err) {
        if (cancelled) return
        setError(
          err?.response?.data?.message ||
            "Couldn't load your inbox. Please try again.",
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadInbox()

    return () => {
      cancelled = true
    }
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
    setActionError(null)

    // Keep the previous state around so we can roll back on failure
    const previous = requests

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    )

    try {
      await respondToRequest(id, status)
    } catch (err) {
      setRequests(previous)
      setActionError(
        err?.response?.data?.message ||
          "Couldn't update that request. Please try again.",
      )
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

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {actionError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
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
                onMessage={(person) => setChatPerson(person)}
              />
            ))}
          </div>
        )}

        {/* Real-time chat wiring lands in Phase 3 — ChatWindow still sends
            to a console.log stub until messageApi.js exists. */}
        {chatPerson && (
          <ChatWindow
            conversation={{
              person: {
                id: chatPerson.userId,
                name: chatPerson.name,
                role: chatPerson.title,
                avatar: chatPerson.initials,
                color: chatPerson.avatarColor,
                online: false,
              },
              messages: [],
            }}
            onBack={() => setChatPerson(null)}
            onSend={(text, person) => {
              console.log("Message:", text, "to:", person)
            }}
          />
        )}
      </div>
    </div>
  )
}
