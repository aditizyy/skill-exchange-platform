export default function MessageBubble({ message }) {
  const mine = message.sender === "me"

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          mine ? "items-end" : "items-start"
        } flex max-w-[82%] flex-col gap-1`}
      >
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${
            mine
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm bg-card text-card-foreground shadow-sm"
          }`}
        >
          {message.text}
        </div>

        <time className="px-1 text-[11px] text-muted-foreground">
          {message.time}
        </time>
      </div>
    </div>
  )
}