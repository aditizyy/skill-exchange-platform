import { useMemo, useState } from "react"
import { Plus, Search, X } from "lucide-react"

export default function SkillTagSelector({
  label,
  icon,
  placeholder,
  selected,
  onToggle,
  onRemove,
  suggestions,
  accent,
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return suggestions
      .filter((s) => !selected.includes(s))
      .filter((s) => (q ? s.toLowerCase().includes(q) : true))
      .slice(0, 6)
  }, [query, suggestions, selected])

  const canAddCustom =
    query.trim().length > 0 &&
    !suggestions.some(
      (s) => s.toLowerCase() === query.trim().toLowerCase()
    ) &&
    !selected.some(
      (s) => s.toLowerCase() === query.trim().toLowerCase()
    )

  const chipClasses =
    accent === "teach"
      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
      : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <span className="text-blue-600">{icon}</span>
        {label}
      </label>

      <div className="rounded-xl border border-slate-200 bg-white p-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        {selected.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selected.map((skill) => (
              <span
                key={skill}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${chipClasses}`}
              >
                {skill}

                <button
                  type="button"
                  onClick={() => onRemove(skill)}
                  className="rounded-full p-0.5 transition-colors hover:bg-white/60"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />

            <input
              type="text"
              value={query}
              placeholder={placeholder}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {open && (filtered.length > 0 || canAddCustom) && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {filtered.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onToggle(skill)
                    setQuery("")
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-blue-50"
                >
                  {skill}
                  <Plus className="h-4 w-4 text-blue-500" />
                </button>
              ))}

              {canAddCustom && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onToggle(query.trim())
                    setQuery("")
                  }}
                  className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4" />
                  {`Add "${query.trim()}"`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
