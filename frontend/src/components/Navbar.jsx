"use client"

import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X, ChevronDown, LogOut, User, Settings } from "lucide-react"

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Inbox", to: "/inbox" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            S
          </span>
          <span className="text-lg font-bold text-slate-900">
            Skill Exchange
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side: avatar + dropdown + logout (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-2 transition-colors hover:bg-slate-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                
              </span>

              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />

                <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3 px-2 pb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  
                </p>
                <p className="truncate text-xs text-slate-500">
                  
                </p>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}