import { useEffect, useState } from "react"
import {
  getOrCreateConversation,
  getMessages,
  sendMessage,
} from "../api/messageApi"
import { formatMessageTime } from "../utils/formatTime"
import { useAuth } from "../context/AuthContext"

// There's no WebSocket layer yet, so an open conversation is kept fresh by
// polling on this interval. Fine for a low-traffic 1:1 chat; revisit if
// real-time delivery becomes a requirement.
const MESSAGE_POLL_INTERVAL_MS = 4000

// Any page using this hook must pass a `person` object with a `.userId`
// field (the *user* id to message) to openChatWith — even if that page
// also tracks some other id (like a Request id) under `.id`.
export function useChatPopup() {
  const { user } = useAuth()

  const [chatPerson, setChatPerson] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState(null)

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

  return {
    chatPerson,
    chatLoading,
    chatError,
    displayMessages,
    openChatWith,
    closeChat,
    handleSendMessage,
  }
}