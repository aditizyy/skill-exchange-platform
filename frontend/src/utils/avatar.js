const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-sky-600",
  "bg-cyan-700",
  "bg-blue-500",
  "bg-violet-600",
  "bg-teal-600",
]

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getAvatarColor(seed = "") {
  let hash = 0

  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index]
}
