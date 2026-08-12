"use client"

import { useState } from "react"
import ProfileForm from "../components/profile/ProfileForm"

const SKILL_LIBRARY = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "UI/UX Design",
  "Figma",
  "Photography",
  "Public Speaking",
  "Spanish",
  "French",
  "Guitar",
  "Piano",
  "Cooking",
  "Digital Marketing",
  "SEO",
  "Data Analysis",
  "Machine Learning",
  "Illustration",
  "Video Editing",
  "Yoga",
  "Writing",
  "Excel",
  "Project Management",
]

export default function ProfileSetup() {
  const [photo, setPhoto] = useState(null)
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [teachSkills, setTeachSkills] = useState([])
  const [learnSkills, setLearnSkills] = useState([])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  const toggle = (list, setList, skill) => {
    setList(
      list.includes(skill)
        ? list.filter((s) => s !== skill)
        : [...list, skill]
    )
  }

  const handleSave = (e) => {
    e.preventDefault()
    console.log("[v0] Profile saved:", {
      fullName,
      bio,
      teachSkills,
      learnSkills,
      photo,
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl text-balance">
            Set up your profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 text-pretty">
            Tell the community who you are and what skills you want to exchange.
          </p>
        </div>

        <ProfileForm
          photo={photo}
          onPhotoChange={handlePhotoChange}
          fullName={fullName}
          setFullName={setFullName}
          bio={bio}
          setBio={setBio}
          teachSkills={teachSkills}
          learnSkills={learnSkills}
          onTeachSkillToggle={(s) =>
            toggle(teachSkills, setTeachSkills, s)
          }
          onLearnSkillToggle={(s) =>
            toggle(learnSkills, setLearnSkills, s)
          }
          onTeachSkillRemove={(s) =>
            toggle(teachSkills, setTeachSkills, s)
          }
          onLearnSkillRemove={(s) =>
            toggle(learnSkills, setLearnSkills, s)
          }
          suggestions={SKILL_LIBRARY}
          onSubmit={handleSave}
        />
      </div>
    </main>
  )
}

