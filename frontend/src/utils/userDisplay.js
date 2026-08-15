// Backend users only carry name / skillsToTeach / skillsToLearn / avatarUrl.
// The existing MatchCard / RequestCard components were built against mock
// data that also included initials, avatarColor, title, and location.
// These helpers bridge that gap without having to touch those components.

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-sky-600",
  "bg-cyan-700",
  "bg-blue-500",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-rose-600",
];

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Deterministic so the same user always gets the same color across renders/sessions
export function getAvatarColor(id = "") {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// Maps a backend user object (from suggested matches or a populated request)
// into the { id, name, title, location, initials, avatarColor, teach, learn }
// shape the existing UI components expect.
export function mapUserToDisplayPerson(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name || "Unknown User",
    title: "Skill Exchange Member",
    location: "",
    initials: getInitials(user.name),
    avatarColor: getAvatarColor(user.id),
    teach: user.skillsToTeach || [],
    learn: user.skillsToLearn || [],
    email: user.email,
  };
}