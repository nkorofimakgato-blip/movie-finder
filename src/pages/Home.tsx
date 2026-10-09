import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TMDBItem } from '../types/tmdb'
import { getTrending, backdropUrl } from '../api/tmdb'
import PosterCard from '../components/PosterCard'

function Home() {
  const [items, setItems] = useState<TMDBItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await getTrending()
        // Filter out people (search results can include them)
        setItems(data.results.filter((i) => i.media_type !== 'person'))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  // Hero picks the first trending item with a backdrop
  const hero = items.find((i) => i.backdrop_path)

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[520px] overflow-hidden">
        {hero?.backdrop_path && (
          <img
            src={backdropUrl(hero.backdrop_path)!}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            What do you want to watch?
          </h1>
          <p className="text-gray-300 mb-6 max-w-xl">
            Search thousands of movies and TV shows. Save the ones you love.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie or TV show…"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900/90 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Trending grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">🔥 Trending this week</h2>

        {loading && (
          <div className="text-gray-400 text-center py-16">Loading…</div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <PosterCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home