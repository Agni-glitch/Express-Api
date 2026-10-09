import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth, useSignOut } from '../context/AuthContext.jsx'
import { Button, LinkButton } from './ui.jsx'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-zinc-800 text-amber-300' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
  }`

export default function Navbar() {
  const { user, isAdmin } = useAuth()
  const signOut = useSignOut()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const handleLogout = () => {
    close()
    signOut()
  }

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" onClick={close} className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-400 text-zinc-950">
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M6 4l10 6-10 6z" />
            </svg>
          </span>
          Cineflix
        </Link>

        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-zinc-300 hover:bg-zinc-800 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M3 5h14v2H3zM3 9h14v2H3zM3 13h14v2H3z" />
          </svg>
        </button>

        <div
          className={`${
            open ? 'flex' : 'hidden'
          } w-full flex-col gap-1 md:flex md:w-auto md:flex-1 md:flex-row md:items-center`}
        >
          <NavLink to="/" end className={linkClass} onClick={close}>
            Home
          </NavLink>
          <NavLink to="/movies" end className={linkClass} onClick={close}>
            Movies
          </NavLink>
          <NavLink to="/genres" className={linkClass} onClick={close}>
            Genres
          </NavLink>
          <NavLink to="/stats" className={linkClass} onClick={close}>
            Stats
          </NavLink>
          {isAdmin && (
            <>
              <NavLink to="/movies/new" className={linkClass} onClick={close}>
                Add movie
              </NavLink>
              <NavLink to="/admin/users" className={linkClass} onClick={close}>
                Users
              </NavLink>
            </>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 md:ml-auto md:mt-0">
            {user ? (
              <>
                <NavLink to="/profile" className={linkClass} onClick={close}>
                  {user.name}
                  {isAdmin && (
                    <span className="ml-2 rounded bg-amber-400/15 px-1.5 py-0.5 text-xs text-amber-300">admin</span>
                  )}
                </NavLink>
                <Button variant="secondary" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <LinkButton variant="ghost" to="/login" onClick={close}>
                  Log in
                </LinkButton>
                <LinkButton to="/signup" onClick={close}>
                  Sign up
                </LinkButton>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
