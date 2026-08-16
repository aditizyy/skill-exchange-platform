import { Link } from "react-router-dom"
import { Compass, ArrowLeft, Home } from "lucide-react"

export default function NotFoundPage() {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        {/* Icon illustration */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
          <Compass className="h-12 w-12 text-blue-600" strokeWidth={1.5} aria-hidden="true" />
        </div>

        {/* 404 heading */}
        <h1 className="text-7xl font-bold tracking-tight text-blue-600 sm:text-8xl">404</h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl text-balance">Page Not Found</h2>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-500 text-pretty">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go to Home
          </Link>
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go Back
          </button>
        </div>
      </div>
    </main>
  )
}
