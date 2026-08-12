import {
  Check,
  GraduationCap,
  Lightbulb,
  X,
} from "lucide-react"

const STATUS_BADGE = {
  accepted: {
    label: "Accepted",
    className:
      "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    Icon: Check,
  },
  declined: {
    label: "Declined",
    className:
      "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
    Icon: X,
  },
}

export default function RequestCard({ req, updateStatus }) {
  const badge = STATUS_BADGE[req.status]

  return (
    <article
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      {/* Top: avatar + name + status badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${req.avatarColor}`}
          >
            {req.initials}
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-semibold text-slate-900">
              {req.name}
            </h2>

            <p className="truncate text-xs text-slate-500">
              {req.title}
            </p>
          </div>
        </div>

        {badge && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
          >
            <badge.Icon className="h-3.5 w-3.5" />
            {badge.label}
          </span>
        )}
      </div>

      {/* Teach */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          Can teach
        </div>

        <div className="flex flex-wrap gap-1.5">
          {req.teach.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Learn */}
      <div className="mt-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Lightbulb className="h-4 w-4 text-slate-400" />
          Wants to learn
        </div>

        <div className="flex flex-wrap gap-1.5">
          {req.learn.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Actions (pending only) */}
      {req.status === "pending" && (
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => updateStatus(req.id, "accepted")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            Accept
          </button>

          <button
            type="button"
            onClick={() => updateStatus(req.id, "declined")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600"
          >
            <X className="h-4 w-4" />
            Decline
          </button>
        </div>
      )}
    </article>
  )
}