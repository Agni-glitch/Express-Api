import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client.js'
import { useApi } from '../hooks/useApi.js'
import { Alert, Button, Card, Field, LinkButton, Loading, PageHeader } from '../components/ui.jsx'
import { GENRES } from '../constants.js'

const EMPTY = {
  name: '',
  description: '',
  duration: '',
  ratings: '',
  totalRating: '',
  releaseYear: '',
  releaseDate: '',
  genres: [],
  directors: '',
  actors: '',
  coverImage: '',
  price: '',
}

const toForm = (movie) => ({
  ...EMPTY,
  ...Object.fromEntries(Object.keys(EMPTY).map((key) => [key, movie[key] ?? EMPTY[key]])),
  releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : '',
  directors: (movie.directors || []).join(', '),
  actors: (movie.actors || []).join(', '),
})

const toList = (text) =>
  text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const toNumber = (value) => (value === '' ? undefined : Number(value))

export default function MovieForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const existing = useApi(isEdit ? `/movies/${id}` : null)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (existing.data) setForm(toForm(existing.data.data.movie))
  }, [existing.data])

  if (existing.loading) return <Loading />
  if (existing.error) return <Alert>{existing.error.message}</Alert>

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const toggleGenre = (genre) =>
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.genres.length === 0) return setError('Pick at least one genre.')

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      duration: toNumber(form.duration),
      ratings: toNumber(form.ratings),
      totalRating: toNumber(form.totalRating),
      releaseYear: toNumber(form.releaseYear),
      releaseDate: form.releaseDate || undefined,
      genres: form.genres,
      directors: toList(form.directors),
      actors: toList(form.actors),
      coverImage: form.coverImage.trim(),
      price: toNumber(form.price),
    }

    setSaving(true)
    try {
      const res = await api(isEdit ? `/movies/${id}` : '/movies', { method: isEdit ? 'PATCH' : 'POST', body: payload })
      navigate(`/movies/${res.data.movie._id}`)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={isEdit ? 'Edit movie' : 'Add a movie'} />
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Name" value={form.name} onChange={set('name')} required minLength={4} maxLength={100} />
          <Field label="Description" as="textarea" rows={4} value={form.description} onChange={set('description')} required />

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Duration (minutes)" type="number" min="1" value={form.duration} onChange={set('duration')} required />
            <Field label="Release year" type="number" min="1888" max="2100" value={form.releaseYear} onChange={set('releaseYear')} required />
            <Field
              label="Release date"
              type="date"
              value={form.releaseDate}
              onChange={set('releaseDate')}
              required
              hint="Movies only appear once this date has passed."
            />
            <Field label="Rating (1-5)" type="number" min="1" max="5" step="0.1" value={form.ratings} onChange={set('ratings')} />
            <Field label="Number of ratings" type="number" min="0" value={form.totalRating} onChange={set('totalRating')} />
            <Field label="Price ($)" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-300">Genres</legend>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => {
                const active = form.genres.includes(genre)
                return (
                  <button
                    key={genre}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full border px-3 py-1 text-sm transition ${
                      active
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                        : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {genre}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <Field label="Directors" value={form.directors} onChange={set('directors')} required hint="Separate names with commas." />
          <Field label="Cast" value={form.actors} onChange={set('actors')} required hint="Separate names with commas." />
          <Field
            label="Cover image"
            value={form.coverImage}
            onChange={set('coverImage')}
            required
            hint="A full image URL is shown as the poster; anything else gets a generated poster."
          />

          <Alert>{error}</Alert>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={saving}>
              {isEdit ? 'Save changes' : 'Add movie'}
            </Button>
            <LinkButton variant="ghost" to={isEdit ? `/movies/${id}` : '/movies'}>
              Cancel
            </LinkButton>
          </div>
        </form>
      </Card>
    </div>
  )
}
