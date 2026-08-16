// Formats an ISO timestamp into the short "10:41 AM" style MessageBubble
// was already built to display.
export function formatMessageTime(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}