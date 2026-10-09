import { useApi } from '../hooks/useApi.js'
import { Alert, EmptyState, Loading, PageHeader } from '../components/ui.jsx'
import { formatPrice } from '../constants.js'

export default function Stats() {
  const { data, error, loading } = useApi('/movies/movie-stats')
  const stats = [...(data?.data.stats || [])].sort((a, b) => b._id - a._id)

  return (
    <div>
      <PageHeader title="Stats" subtitle="Rating and price figures per release year, as reported by the API." />

      {loading ? (
        <Loading />
      ) : error ? (
        <Alert>{error.message}</Alert>
      ) : stats.length === 0 ? (
        <EmptyState title="No stats to show">
          The API only reports release years that have movies rated 4.5 or higher and a top price of at least $60.
          Nothing in the catalogue matches that right now.
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-4 py-3">Release year</th>
                <th className="px-4 py-3">Movies</th>
                <th className="px-4 py-3">Avg rating</th>
                <th className="px-4 py-3">Avg price</th>
                <th className="px-4 py-3">Min price</th>
                <th className="px-4 py-3">Max price</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {stats.map((row) => (
                <tr key={row._id} className="hover:bg-zinc-900/60">
                  <td className="px-4 py-3 font-semibold text-zinc-100">{row._id}</td>
                  <td className="px-4 py-3">{row.movieCount}</td>
                  <td className="px-4 py-3 text-amber-400">{row.avgRating?.toFixed(2)}</td>
                  <td className="px-4 py-3">{formatPrice(row.avgPrice)}</td>
                  <td className="px-4 py-3">{formatPrice(row.minPrice)}</td>
                  <td className="px-4 py-3">{formatPrice(row.maxPrice)}</td>
                  <td className="px-4 py-3">{formatPrice(row.priceTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
