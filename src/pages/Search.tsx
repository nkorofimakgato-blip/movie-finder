import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import type { TMDBItem } from '../types/tmdb'
import { searchMulti } from '../api/tmdb'
import PosterCard from '../components/PosterCard'

function Search() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const query = params.get('q') ?? ''

  const [input, setInput] = useState(query)
  const [items, setItems] = useState<TMDBItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch results whenever `q` in the URL changes
  useEffect(() => {
    setInput(query)

    if (!query.trim()) {
      setItems([])
      return
    }

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await searchMulti(query)
        // Filter out people
        setItems(data.results.filter((i) => i.media_type !== 'person'))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [query])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (input.trim()) {
      navigate(`/search?q=${encodeURIComponent(input.trim())}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search movies and TV shows…"
          className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          autoFocus
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      {!query && (
        <p className="text-gray-400">Type something above to search.</p>
      )}

      {loading && (
        <div className="text-gray-400 text-center py-16">Searching…</div>
      )}

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && query && items.length === 0 && (
        <p className="text-gray-400">
          No results for "{query}". Try another title.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-6">
            Results for "{query}" ({items.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <PosterCard
                key={`${item.media_type}-${item.id}`}
                item={item}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Search