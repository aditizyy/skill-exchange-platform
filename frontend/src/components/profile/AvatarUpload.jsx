import { useRef } from "react"
import { Camera, User } from "lucide-react"

export default function AvatarUpload({ photo, onPhotoChange }) {
  const fileInputRef = useRef(null)

  return (
    <div className="flex flex-col items-center gap-3 border-b border-slate-100 pb-6">
      <div className="relative">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-4 ring-blue-50">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo || "/placeholder.svg"}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-slate-300" />
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-colors hover:bg-blue-700"
          aria-label="Upload profile photo"
        >
          <Camera className="h-4 w-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
          className="hidden"
        />
      </div>

      <p className="text-xs text-slate-400">JPG or PNG, up to 5MB</p>
    </div>
  )
}

