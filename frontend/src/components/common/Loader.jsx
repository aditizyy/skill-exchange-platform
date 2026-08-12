export default function Loader({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
    </div>
  )
}