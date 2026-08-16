export default function Badge({
  children,
  onRemove,
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ${className}`}
    >
      {children}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 text-blue-500 hover:text-blue-700"
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </span>
  )
}