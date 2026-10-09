// Must match the `genres` enum in the API's movie model.
export const GENRES = [
  'Action',
  'Adventure',
  'Sci-Fi',
  'Thriller',
  'Crime',
  'Drama',
  'Romance',
  'Comedy',
  'Horror',
  'Biography',
]

export const SORT_OPTIONS = [
  { value: '', label: 'Recently added' },
  { value: '-ratings', label: 'Top rated' },
  { value: '-releaseYear', label: 'Newest release' },
  { value: 'releaseYear', label: 'Oldest release' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: 'name', label: 'Name (A-Z)' },
]

export const formatPrice = (price) => (typeof price === 'number' ? `$${price.toFixed(2)}` : '-')

export const formatDuration = (minutes) => {
  if (typeof minutes !== 'number') return '-'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${m}m` : `${m}m`
}
