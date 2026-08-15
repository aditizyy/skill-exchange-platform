"use client"

import { useMemo, useState } from "react"
import { Clock } from "lucide-react"

import RequestCard from "../components/inbox/RequestCard"
import RequestTabs from "../components/inbox/RequestTabs"
import ChatWindow from "../components/messages/ChatWindow"

const INITIAL_REQUESTS = [
  {
    id: 1,
    name: "Aditi",
    title: "Product Designer",
    initials: "A",
    avatarColor: "bg-blue-600",
    teach: ["UI/UX Design", "Figma", "Illustration"],
    learn: ["React", "TypeScript"],
    status: "pending",
  },
  {
    id: 2,
    name: "Kashika Soni",
    title: "Frontend Engineer",
    initials: "KS",
    avatarColor: "bg-indigo-600",
    teach: ["React", "TypeScript", "Node.js"],
    learn: ["UI/UX Design", "Public Speaking"],
    status: "pending",
  },
  {
    id: 3,
    name: "Disha kushwaha",
    title: "Marketing Lead",
    initials: "DK",
    avatarColor: "bg-sky-600",
    teach: ["Digital Marketing", "SEO", "Writing"],
    learn: ["Data Analysis", "Excel"],
    status: "accepted",
  },
  {
    id: 4,
    name: "Aastha Singh",
    title: "Data Scientist",
    initials: "AS",
    avatarColor: "bg-cyan-700",
    teach: ["Python", "Machine Learning", "Data Analysis"],
    learn: ["Guitar", "Spanish"],
    status: "declined",
  },
  {
    id: 5,
    name: "Vriti",
    title: "Language Tutor",
    initials: "V",
    avatarColor: "bg-blue-500",
    teach: ["Spanish", "French", "Public Speaking"],
    learn: ["Photography", "Video Editing"],
    status: "pending",
  },
]

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
]

export default function Inbox() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [activeTab, setActiveTab] = useState("pending")
  const [chatPerson, setChatPerson] = useState(null)

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

  const updateStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    )
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

        {/* Cards */}
        {visible.length === 0 ? (
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
        {chatPerson && (
          <ChatWindow
            conversation={{
              person: {
                id: chatPerson.id,
                name: chatPerson.name,
                role: chatPerson.title,
                avatar: chatPerson.initials,
                color: chatPerson.avatarColor,
                online: true,
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