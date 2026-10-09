import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../hooks/useApi.js'
import { MovieGrid } from '../components/MovieCard.jsx'
import { Alert, EmptyState, LinkButton, Loading } from '../components/ui.jsx'

export default function Home() {
  const { user } = useAuth()
  const { data, error, loading } = useApi('/movies/highest-rated')
  const movies = data?.data.movies || []

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/40 px-6 py-14 sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">Your movie database</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Find something worth watching tonight.
        </h1>
        <p className="mt-4 max-w-xl text-zinc-400">
          Browse the full catalogue, filter by genre and rating, and see what the numbers say.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton to="/movies">Browse movies</LinkButton>
          {!user && (
            <LinkButton variant="secondary" to="/signup">
              Create an account
            </LinkButton>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold">Highest rated</h2>
        {loading ? (
          <Loading />
        ) : error ? (
          <Alert>{error.message}</Alert>
        ) : movies.length === 0 ? (
          <EmptyState title="No movies yet">Once movies are added they will show up here.</EmptyState>
        ) : (
          <MovieGrid movies={movies} />
        )}
      </section>
    </div>
  )
}
