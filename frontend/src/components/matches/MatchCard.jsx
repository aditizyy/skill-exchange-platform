import {
  Check,
  GraduationCap,
  Lightbulb,
  UserPlus,
} from "lucide-react"

export default function MatchCard({ person, isRequested, onToggleRequest }) {
  return (
    <article
      key={person.id}
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      {/* Top: avatar + name */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${person.avatarColor}`}
        >
          {person.initials}
        </div>

        <div className="min-w-0">
          <h2 className="truncate font-semibold text-slate-900">
            {person.name}
          </h2>

          <p className="truncate text-xs text-slate-500">
            {person.title} &middot; {person.location}
          </p>
        </div>
      </div>

      {/* Teach */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          Can teach
        </div>

        <div className="flex flex-wrap gap-1.5">
          {person.teach.map((skill) => (
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
          {person.learn.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={() => onToggleRequest(person.id)}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          isRequested
            ? "bg-blue-50 text-blue-700"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isRequested ? (
          <>
            <Check className="h-4 w-4" />
            Request Sent
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Send Request
          </>
        )}
      </button>
    </article>
  )
}