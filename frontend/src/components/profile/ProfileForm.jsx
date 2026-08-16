import {
  Check,
  GraduationCap,
  Lightbulb,
} from "lucide-react"

import AvatarUpload from "./AvatarUpload"
import SkillTagSelector from "./SkillTagSelector"

export default function ProfileForm({
  photo,
  onPhotoChange,
  fullName,
  setFullName,
  teachSkills,
  learnSkills,
  onTeachSkillToggle,
  onLearnSkillToggle,
  onTeachSkillRemove,
  onLearnSkillRemove,
  suggestions,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Photo upload */}
      <AvatarUpload
        photo={photo}
        onPhotoChange={onPhotoChange}
      />

      {/* Full name */}
      <div className="mt-6 flex flex-col gap-2">
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-slate-700"
        >
          Full Name
        </label>

        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Jordan Rivera"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Skills to teach */}
      <div className="mt-5">
        <SkillTagSelector
          label="Skills I Can Teach"
          icon={<GraduationCap className="h-4 w-4" />}
          placeholder="Search skills to teach..."
          selected={teachSkills}
          onToggle={onTeachSkillToggle}
          onRemove={onTeachSkillRemove}
          suggestions={suggestions}
          accent="teach"
        />
      </div>

      {/* Skills to learn */}
      <div className="mt-5">
        <SkillTagSelector
          label="Skills I Want to Learn"
          icon={<Lightbulb className="h-4 w-4" />}
          placeholder="Search skills to learn..."
          selected={learnSkills}
          onToggle={onLearnSkillToggle}
          onRemove={onLearnSkillRemove}
          suggestions={suggestions}
          accent="learn"
        />
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          Skip for now
        </button>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Check className="h-4 w-4" />
          Save &amp; Continue
        </button>
      </div>
    </form>
  )
}

