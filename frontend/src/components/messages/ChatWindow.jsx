import { useState } from "react"
import { ArrowLeft, Circle, Send, X } from "lucide-react"
import MessageBubble from "./MessageBubble"

export default function ChatWindow({ conversation, onBack, onSend }) {
  const [draft, setDraft] = useState("")
  const messages = conversation?.messages || []

  function submit(event) {
    event.preventDefault()

    const text = draft.trim()

    if (!text) return

    onSend?.(text, conversation.person)
    setDraft("")
  }

  if (!conversation) {
    return (
      <section className="flex min-h-[420px] flex-1 items-center justify-center rounded-3xl border border-dashed border-border bg-white p-8 text-center">
        <div>
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Send size={20} />
          </div>

          <h2 className="mt-4 font-semibold text-card-foreground">
            Choose a conversation
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            Select a connection to start exchanging ideas.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="fixed bottom-4 right-4 z-20 flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

      {/* Header */}
      <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft size={17} />
        </button>

        <div
          className={`${conversation.person.color} flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-primary-foreground`}
        >
          {conversation.person.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-card-foreground">
            {conversation.person.name}
          </h2>

          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Circle
              className={`size-2 fill-current ${
                conversation.person.online
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            {conversation.person.online ? "Online" : "Offline"}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Close chat"
        >
          <X size={17} />
        </button>
      </header>

      {/* Messages */}
      <div className="flex h-[260px] flex-col gap-3 overflow-y-auto bg-slate-50 p-3">
        {messages.length ? (
          <>
            <div className="text-center text-[10px] font-medium text-muted-foreground">
              Today
            </div>

            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
              />
            ))}
          </>
        ) : (
          <div className="m-auto text-center">
            <p className="text-sm font-medium text-card-foreground">
              No messages yet
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Say hello and start the exchange.
            </p>
          </div>
        )}
      </div>

      {/* Small message bar */}
      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-t border-slate-200 bg-white p-2"
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message..."
          aria-label="Type a message"
          className="h-9 min-w-0 flex-1 rounded-lg bg-slate-100 px-3 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-primary"
        />

        <button
          type="submit"
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          <Send size={15} />
        </button>
      </form>
    </section>
  )
}