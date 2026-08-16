"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock } from "lucide-react"

import RequestCard from "../components/inbox/RequestCard"
import RequestTabs from "../components/inbox/RequestTabs"
import ChatWindow from "../components/messages/ChatWindow"
import Loader from "../components/common/Loader"
import { getInboxRequests, respondToRequest } from "../api/matchApi"
import {
  getOrCreateConversation,
  getMessages,
  sendMessage,
} from "../api/messageApi"
import { mapUserToDisplayPerson } from "../utils/userDisplay"
import { formatMessageTime } from "../utils/formatTime"
import { useAuth } from "../context/AuthContext"

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

// There's no WebSocket layer yet, so an open conversation is kept fresh by
// polling on this interval. Fine for a low-traffic 1:1 chat; revisit if
// real-time delivery becomes a requirement.
const MESSAGE_POLL_INTERVAL_MS = 4000

export default function Inbox() {
  const { user } = useAuth()

  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)

  // Chat popup state
  const [chatPerson, setChatPerson] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState(null)

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

  // Open (or create) the conversation and load its message history whenever
  // a chat is opened.
  useEffect(() => {
    if (!chatPerson) return

    let cancelled = false

    async function openChat() {
      setChatLoading(true)
      setChatError(null)

      try {
        const convoRes = await getOrCreateConversation(chatPerson.userId)
        if (cancelled) return
        setConversationId(convoRes.conversation.id)

        const msgsRes = await getMessages(convoRes.conversation.id)
        if (cancelled) return
        setChatMessages(msgsRes.messages || [])
      } catch (err) {
        if (cancelled) return
        setChatError(
          err?.response?.data?.message ||
            "Couldn't open this conversation. Please try again.",
        )
      } finally {
        if (!cancelled) setChatLoading(false)
      }
    }

    openChat()

    return () => {
      cancelled = true
    }
  }, [chatPerson])

  // Poll for new messages while a conversation is open.
  useEffect(() => {
    if (!conversationId) return

    const interval = setInterval(async () => {
      try {
        const msgsRes = await getMessages(conversationId)
        setChatMessages(msgsRes.messages || [])
      } catch {
        // Silent — a single missed poll isn't worth interrupting the user;
        // the next tick will catch up.
      }
    }, MESSAGE_POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [conversationId])

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

  const openChatWith = (person) => {
    setChatPerson(person)
    setConversationId(null)
    setChatMessages([])
    setChatError(null)
  }

  const closeChat = () => {
    setChatPerson(null)
    setConversationId(null)
    setChatMessages([])
    setChatError(null)
  }

  const updateStatus = async (id, status) => {
    setActionError(null)

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

  const handleSendMessage = async (text) => {
    if (!conversationId) return

    try {
      const res = await sendMessage(conversationId, text)
      setChatMessages((prev) => [...prev, res.message])
    } catch (err) {
      setChatError(
        err?.response?.data?.message ||
          "Couldn't send that message. Please try again.",
      )
    }
  }

  const displayMessages = chatMessages.map((m) => ({
    id: m.id,
    text: m.text,
    time: formatMessageTime(m.createdAt),
    sender: m.senderId === user?.id ? "me" : "them",
  }))

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

        {chatError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {chatError}
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
                onMessage={(person) => openChatWith(person)}
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
                role: chatPerson.title,
                avatar: chatPerson.initials,
                color: chatPerson.avatarColor,
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
