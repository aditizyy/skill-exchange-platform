"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"

import ConnectedUserCard from "../components/connections/ConnectedUserCard"
import ChatWindow from "../components/messages/ChatWindow"
import Loader from "../components/common/Loader"
import { getConnections } from "../api/matchApi"
import { mapUserToConnectionCard } from "../utils/userDisplay"
import { useChatPopup } from "../hooks/useChatPopup"

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    chatPerson,
    chatLoading,
    chatError,
    displayMessages,
    openChatWith,
    closeChat,
    handleSendMessage,
  } = useChatPopup()

  useEffect(() => {
    let cancelled = false

    async function loadConnections() {
      setLoading(true)
      setError(null)

      try {
        const res = await getConnections()
        if (cancelled) return
        const mapped = (res.connections || []).map((c) =>
          mapUserToConnectionCard(c.user),
        )
        setConnections(mapped)
      } catch (err) {
        if (cancelled) return
        setError(
          err?.response?.data?.message ||
            "Couldn't load your connections. Please try again.",
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadConnections()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Connections
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            People you've connected with for skill exchange.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {chatError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {chatError}
          </div>
        )}

        {/* Connections */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : connections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-slate-300" />

            <p className="text-sm text-slate-500">
              No connections yet. Accept a request in your Inbox to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((person) => (
              <ConnectedUserCard
                key={person.id}
                person={person}
                onMessage={(p) => openChatWith(p)}
              />
            ))}
          </div>
        )}

        {/* Chat popup */}
        {chatPerson && chatLoading && (
          <div className="fixed bottom-4 right-4 z-20 flex w-[min(380px,calc(100vw-2rem))] items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl">
            <Loader />
          </div>
        )}

        {chatPerson && !chatLoading && (
          <ChatWindow
            conversation={{
              person: {
                id: chatPerson.userId,
                name: chatPerson.name,
                role: chatPerson.role,
                avatar: chatPerson.avatar,
                color: chatPerson.color,
                online: false,
              },
              messages: displayMessages,
            }}
            onBack={() => closeChat()}
            onSend={(text) => handleSendMessage(text)}
          />
        )}
      </div>
    </div>
  )
}
