import MatchCard from "./MatchCard"

export default function MatchList({
  filtered,
  requested,
  toggleRequest,
}) {
  return (
    <>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">
            No matches found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((person) => {
            const isRequested = requested.includes(person.id)

            return (
              <MatchCard
                key={person.id}
                person={person}
                isRequested={isRequested}
                onToggleRequest={toggleRequest}
              />
            )
          })}
        </div>
      )}
    </>
  )
}