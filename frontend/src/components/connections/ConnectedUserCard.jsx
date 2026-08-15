import { Check, Circle, MessageCircle, UserRound } from "lucide-react"

export default function ConnectedUserCard({
  person,
  onViewProfile,
  onMessage,
}) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* User information */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div
            className={`${person.color} flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-primary-foreground`}
          >
            {person.avatar}
          </div>

          <Circle
            className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-card ${
              person.online
                ? "fill-primary text-primary"
                : "fill-muted text-muted-foreground"
            }`}
            aria-label={person.online ? "Online" : "Offline"}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-semibold text-card-foreground">
              {person.name}
            </h3>

            <span className="shrink-0 text-[11px] text-muted-foreground">
              {person.online ? "Online" : "Offline"}
            </span>
          </div>

          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {person.bio || person.role}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2 text-sm">
        <SkillRow
          label="Offers"
          skills={person.offers}
        />

        <SkillRow
          label="Wants"
          skills={person.learns}
          muted
        />
      </div>

      {/* Connected status */}
      <div className="flex items-center gap-2 text-xs font-semibold text-primary">
        <Check size={15} />
        Connected
      </div>

      {/* Buttons */}
      <div className="mt-auto flex gap-2">
        <button
          type="button"
          onClick={() => onViewProfile?.(person)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
        >
          <UserRound size={14} />
          View Profile
        </button>

        <button
          type="button"
          onClick={() => onMessage?.(person)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
        >
          <MessageCircle size={14} />
          Message
        </button>
      </div>
    </article>
  )
}

function SkillRow({ label, skills = [], muted }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>

      {skills.map((skill) => (
        <span
          key={skill}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            muted
              ? "bg-muted text-muted-foreground"
              : "bg-accent text-accent-foreground"
          }`}
        >
          {skill}
        </span>
      ))}
    </div>
  )
}

export { SkillRow }