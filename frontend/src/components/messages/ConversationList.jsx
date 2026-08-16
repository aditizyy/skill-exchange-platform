import { Circle, MessageCircle } from "lucide-react"

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}) {
  return (
    <section
      aria-labelledby="conversation-list-title"
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <h2
          id="conversation-list-title"
          className="font-semibold text-card-foreground"
        >
          Messages
        </h2>

        <MessageCircle
          size={17}
          className="text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-1">
        {conversations.map((conversation) => (
          <button
            type="button"
            key={conversation.person.id}
            onClick={() => onSelect?.(conversation)}
            className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
              selectedId === conversation.person.id
                ? "bg-accent"
                : "hover:bg-muted"
            }`}
          >
            <div className="relative shrink-0">
              <div
                className={`${conversation.person.color} flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold text-primary-foreground`}
              >
                {conversation.person.avatar}
              </div>

              <Circle
                className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${
                  conversation.person.online
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted-foreground"
                }`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-card-foreground">
                  {conversation.person.name}
                </span>

                <time className="shrink-0 text-[11px] text-muted-foreground">
                  {conversation.time}
                </time>
              </div>

              <p className="truncate text-xs text-muted-foreground">
                {conversation.lastMessage || "Start a conversation"}
              </p>
            </div>

            {conversation.unread > 0 && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {conversation.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}