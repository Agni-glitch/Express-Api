import { useState } from 'react'

const GRADIENTS = [
  'from-amber-500 to-rose-700',
  'from-sky-500 to-indigo-800',
  'from-emerald-500 to-teal-800',
  'from-fuchsia-500 to-purple-800',
  'from-orange-500 to-red-800',
  'from-cyan-500 to-blue-800',
]

const hash = (text = '') => [...text].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)

/**
 * Shows the cover image when `coverImage` is a usable URL. The seed data only
 * stores bare file names, so anything else falls back to a generated poster.
 */
export default function Poster({ movie, className = '' }) {
  const [failed, setFailed] = useState(false)
  const src = movie.coverImage
  const isUrl = typeof src === 'string' && /^(https?:)?\/\//.test(src)

  if (isUrl && !failed) {
    return (
      <img
        src={src}
        alt={`${movie.name} cover`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`aspect-[2/3] w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex aspect-[2/3] w-full flex-col justify-end bg-gradient-to-br p-4 ${
        GRADIENTS[hash(movie.name) % GRADIENTS.length]
      } ${className}`}
    >
      <span className="text-xs font-medium uppercase tracking-widest text-white/70">{movie.releaseYear}</span>
      <span className="text-lg font-extrabold leading-tight text-white drop-shadow">{movie.name}</span>
    </div>
  )
}
