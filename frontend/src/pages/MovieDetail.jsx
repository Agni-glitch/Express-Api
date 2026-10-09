import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../hooks/useApi.js'
import Poster from '../components/Poster.jsx'
import { Alert, Button, EmptyState, LinkButton, Loading, Stars } from '../components/ui.jsx'
import { formatDuration, formatPrice } from '../constants.js'

function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-200">{children || '-'}</dd>
    </div>
  )
}

export default function MovieDetail() {
  const { id } = useParams()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const { data, error, loading } = useApi(`/movies/${id}`)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  if (loading) return <Loading />
  if (error) {
    return error.status === 404 || error.status === 400 ? (
      <EmptyState title="Movie not found">
        It may have been removed. <Link className="text-amber-400 hover:underline" to="/movies">Back to movies</Link>
      </EmptyState>
    ) : (
      <Alert>{error.message}</Alert>
    )
  }

  const movie = data.data.movie

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${movie.name}"? This cannot be undone.`)) return
    setDeleting(true)
    setDeleteError('')
    try {
      await api(`/movies/${id}`, { method: 'DELETE' })
      navigate('/movies', { replace: true })
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,280px)_1fr]">
      <Poster movie={movie} className="rounded-2xl" />

      <div className="space-y-6">
        <div>
          <Link to="/movies" className="text-sm text-zinc-400 hover:text-amber-300">
            ← All movies
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{movie.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400">
            <Stars value={movie.ratings} />
            {typeof movie.totalRating === 'number' && <span>{movie.totalRating.toLocaleString()} ratings</span>}
            <span>{movie.releaseYear}</span>
            <span>{formatDuration(movie.duration)}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <Link
                key={genre}
                to={`/movies?genre=${encodeURIComponent(genre)}`}
                className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:border-amber-400 hover:text-amber-300"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>

        <p className="max-w-2xl leading-relaxed text-zinc-300">{movie.description}</p>

        <dl className="grid max-w-2xl grid-cols-2 gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:grid-cols-3">
          <Detail label="Price">{formatPrice(movie.price)}</Detail>
          <Detail label="Release date">
            {movie.releaseDate && new Date(movie.releaseDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </Detail>
          <Detail label="Duration">{formatDuration(movie.duration)}</Detail>
          <Detail label="Directors">{movie.directors?.join(', ')}</Detail>
          <Detail label="Cast">{movie.actors?.join(', ')}</Detail>
          <Detail label="Added by">{movie.createdBy}</Detail>
        </dl>

        {isAdmin && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <LinkButton variant="secondary" to={`/movies/${id}/edit`}>
                Edit movie
              </LinkButton>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>
                Delete movie
              </Button>
            </div>
            <Alert>{deleteError}</Alert>
          </div>
        )}
      </div>
    </div>
  )
}
