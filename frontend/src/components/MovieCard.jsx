import { Link } from 'react-router-dom'
import Poster from './Poster.jsx'
import { Stars } from './ui.jsx'
import { formatDuration, formatPrice } from '../constants.js'

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition hover:-translate-y-1 hover:border-amber-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <Poster movie={movie} />
      <div className="space-y-2 p-4">
        <h3 className="truncate font-semibold text-zinc-100 group-hover:text-amber-300">{movie.name}</h3>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <Stars value={movie.ratings} />
          <span>
            {movie.releaseYear} · {formatDuration(movie.duration)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-zinc-500">{movie.genres?.join(', ')}</span>
          <span className="text-sm font-semibold text-zinc-200">{formatPrice(movie.price)}</span>
        </div>
      </div>
    </Link>
  )
}

export function MovieGrid({ movies }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  )
}
