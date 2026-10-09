import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../hooks/useApi.js'
import { MovieGrid } from '../components/MovieCard.jsx'
import { Alert, Button, EmptyState, LinkButton, Loading, PageHeader, inputClass } from '../components/ui.jsx'
import { GENRES, SORT_OPTIONS } from '../constants.js'

const PAGE_SIZE = 10

export default function Movies() {
  const { isAdmin } = useAuth()
  const [params, setParams] = useSearchParams()
  const genre = params.get('genre') || ''
  const minRating = params.get('minRating') || ''
  const sort = params.get('sort') || ''
  const page = Math.max(parseInt(params.get('page'), 10) || 1, 1)

  const query = new URLSearchParams({ page, limit: PAGE_SIZE })
  if (genre) query.set('genres', genre)
  if (minRating) query.set('ratings[gte]', minRating)
  if (sort) query.set('sort', sort)

  const { data, error, loading } = useApi(`/movies?${query}`)
  const movies = data?.data.movies || []
  // the API doesn't return a total, so a full page means there may be more
  const hasNext = movies.length === PAGE_SIZE

  const update = (changes) => {
    const next = new URLSearchParams(params)
    Object.entries({ page: '', ...changes }).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    setParams(next)
  }

  const hasFilters = genre || minRating || sort

  return (
    <div>
      <PageHeader title="Movies" subtitle="The full catalogue of released movies.">
        {isAdmin && <LinkButton to="/movies/new">Add movie</LinkButton>}
      </PageHeader>

      <div className="mb-8 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Genre</span>
          <select className={inputClass} value={genre} onChange={(e) => update({ genre: e.target.value })}>
            <option value="">All genres</option>
            {GENRES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Minimum rating</span>
          <select className={inputClass} value={minRating} onChange={(e) => update({ minRating: e.target.value })}>
            <option value="">Any rating</option>
            {['3', '3.5', '4', '4.5'].map((r) => (
              <option key={r} value={r}>
                {r}+
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">Sort by</span>
          <select className={inputClass} value={sort} onChange={(e) => update({ sort: e.target.value })}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button variant="secondary" className="w-full" disabled={!hasFilters} onClick={() => setParams({})}>
            Clear filters
          </Button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Alert>{error.message}</Alert>
      ) : movies.length === 0 ? (
        <EmptyState title={page > 1 ? 'No more movies' : 'No movies match these filters'}>
          {page > 1 ? 'You have reached the end of the list.' : 'Try a different genre or a lower rating.'}
        </EmptyState>
      ) : (
        <MovieGrid movies={movies} />
      )}

      {!loading && !error && (page > 1 || hasNext) && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="secondary" disabled={page === 1} onClick={() => update({ page: String(page - 1) })}>
            Previous
          </Button>
          <span className="text-sm text-zinc-400">Page {page}</span>
          <Button variant="secondary" disabled={!hasNext} onClick={() => update({ page: String(page + 1) })}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
