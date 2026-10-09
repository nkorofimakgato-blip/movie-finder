import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TMDBItem } from '../types/tmdb'
import {
  getTrending,
  getNowPlaying,
  getPopular,
  getTopRated,
  getPopularTV,
  backdropUrl,
} from '../api/tmdb'
import Row from '../components/Row'

function Home() {
  const [trending, setTrending] = useState<TMDBItem[]>([])
  const [nowPlaying, setNowPlaying] = useState<TMDBItem[]>([])
  const [popular, setPopular] = useState<TMDBItem[]>([])
  const [topRated, setTopRated] = useState<TMDBItem[]>([])
  const [popularTV, setPopularTV] = useState<TMDBItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [t, np, p, tr, tv] = await Promise.all([
          getTrending(),
          getNowPlaying(),
          getPopular(),
          getTopRated(),
          getPopularTV(),
        ])

        setTrending(t.results.filter((i) => i.media_type !== 'person'))
        setNowPlaying(np.results)
        setPopular(p.results)
        setTopRated(tr.results)
        setPopularTV(tv.results)
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
  const hero = trending.find((i) => i.backdrop_path)

  return (
    <div className="pb-12">
      {/* Hero — compact streaming-site style */}
      <section className="relative h-[400px] sm:h-[500px] overflow-hidden mb-10">
        {hero?.backdrop_path && (
          <>
            <img
              src={backdropUrl(hero.backdrop_path)!}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-transparent" />
          </>
        )}

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight tracking-tight">
              {hero?.title ?? hero?.name ?? 'Welcome'}
            </h1>
            <p className="text-gray-300 mb-5 line-clamp-2 text-sm">
              {hero?.overview}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => hero && navigate(`/${hero.media_type}/${hero.id}`)}
                className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors"
              >
                ▶ Watch now
              </button>
              <button
                onClick={() => hero && navigate(`/${hero.media_type}/${hero.id}`)}
                className="bg-gray-900/70 backdrop-blur border border-gray-700 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                ℹ More info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search bar (floating between hero and rows) */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-10 relative z-20">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies and TV shows…"
            className="flex-1 px-4 py-3 rounded-lg bg-gray-900/90 backdrop-blur border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-[1400px] mx-auto px-4 mb-8">
          <div className="bg-red-950 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Rows */}
      {loading && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 text-center py-16">Loading…</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <Row
            title="🔥 Trending this week"
            items={trending}
            showMeta
          />
          <Row
            title="🎬 New Releases"
            items={nowPlaying}
            mediaType="movie"
            showMeta
          />
          <Row
            title="⭐ Top Rated"
            items={topRated}
            mediaType="movie"
          />
          <Row
            title="📺 Popular TV Shows"
            items={popularTV}
            mediaType="tv"
          />
          <Row
            title="🍿 Popular Movies"
            items={popular}
            mediaType="movie"
          />
        </>
      )}
    </div>
  )
}

export default Home