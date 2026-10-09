import { useSearchParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi.js'
import { Alert, Card, EmptyState, LinkButton, Loading, PageHeader } from '../components/ui.jsx'
import { GENRES } from '../constants.js'

export default function Genres() {
  const [params, setParams] = useSearchParams()
  const genre = GENRES.includes(params.get('genre')) ? params.get('genre') : GENRES[0]
  const { data, error, loading } = useApi(`/movies/movie-by-genre/${encodeURIComponent(genre)}`)
  const group = data?.data.movies[0]

  return (
    <div>
      <PageHeader title="Genres" subtitle="See which movies fall under each genre." />

      <div className="mb-8 flex flex-wrap gap-2">
        {GENRES.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={g === genre}
            onClick={() => setParams({ genre: g })}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              g === genre
                ? 'border-amber-400 bg-amber-400 text-zinc-950'
                : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Alert>{error.message}</Alert>
      ) : !group ? (
        <EmptyState title={`No ${genre} movies yet`} />
      ) : (
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">
              {group.genre}{' '}
              <span className="ml-1 text-sm font-normal text-zinc-400">
                {group.movieCount} {group.movieCount === 1 ? 'movie' : 'movies'}
              </span>
            </h2>
            <LinkButton variant="secondary" to={`/movies?genre=${encodeURIComponent(group.genre)}`}>
              Browse in catalogue
            </LinkButton>
          </div>
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.movies.map((name) => (
              <li key={name} className="truncate border-b border-zinc-800 py-2 text-sm text-zinc-200">
                {name}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
