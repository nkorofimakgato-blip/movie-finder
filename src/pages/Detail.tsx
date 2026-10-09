import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { TMDBDetail, MediaType } from '../types/tmdb'
import { getDetails, backdropUrl, posterUrl, profileUrl } from '../api/tmdb'
import { toggleFavorite, isFavorite } from '../lib/favorites'

function Detail() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const mediaType: MediaType = type === 'tv' ? 'tv' : 'movie'
  const itemId = Number(id)

  const [detail, setDetail] = useState<TMDBDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fav, setFav] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getDetails(itemId, mediaType)
        setDetail(data)
        setFav(isFavorite(itemId))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [itemId, mediaType])

  function handleToggleFav() {
    if (!detail) return
    const nowFav = toggleFavorite(detail, mediaType)
    setFav(nowFav)
  }

  if (loading) {
    return <div className="text-gray-400 text-center py-24">Loading…</div>
  }

  if (error || !detail) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-red-950 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
          {error ?? 'Not found'}
        </div>
        <Link to="/" className="inline-block mt-6 text-amber-400 hover:underline">
          ← Back to home
        </Link>
      </div>
    )
  }

  const title = detail.title ?? detail.name ?? 'Untitled'
  const year = (detail.release_date ?? detail.first_air_date ?? '').slice(0, 4)
  const runtime = detail.runtime
    ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m`
    : detail.number_of_seasons
      ? `${detail.number_of_seasons} season${detail.number_of_seasons > 1 ? 's' : ''}`
      : null

  const backdrop = backdropUrl(detail.backdrop_path)
  const poster = posterUrl(detail.poster_path, 'w342')
  const topCast = detail.credits?.cast?.slice(0, 8) ?? []
  const similar = detail.similar?.results?.filter((i) => i.poster_path).slice(0, 6) ?? []

  return (
    <div>
      {/* Backdrop hero */}
      <section className="relative">
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="w-full h-[300px] sm:h-[420px] object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Poster + favorite */}
          <div>
            {poster && (
              <img
                src={poster}
                alt={title}
                className="w-full rounded-xl shadow-2xl"
              />
            )}
            <button
              onClick={handleToggleFav}
              className={`w-full mt-4 py-3 rounded-lg font-medium transition-colors ${
                fav
                  ? 'bg-amber-500 text-gray-950 hover:bg-amber-400'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              {fav ? '★ In favorites' : '☆ Add to favorites'}
            </button>
          </div>

          {/* Details */}
          <div className="pt-4">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h1>

            {detail.tagline && (
              <p className="italic text-amber-400/80 mb-4">{detail.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-6">
              {year && <span>{year}</span>}
              {runtime && <span>·</span>}
              {runtime && <span>{runtime}</span>}
              <span>·</span>
              <span className="flex items-center gap-1">
                ⭐ {detail.vote_average.toFixed(1)}
              </span>
              {detail.genres && detail.genres.length > 0 && (
                <>
                  <span>·</span>
                  <span>{detail.genres.map((g) => g.name).join(', ')}</span>
                </>
              )}
            </div>

            <h2 className="text-lg font-bold mb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              {detail.overview || 'No overview available.'}
            </p>

            {topCast.length > 0 && (
              <>
                <h2 className="text-lg font-bold mb-4">Cast</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {topCast.map((person) => {
                    const pUrl = profileUrl(person.profile_path)
                    return (
                      <div
                        key={person.id}
                        className="flex-shrink-0 w-28 text-center"
                      >
                        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-800 mb-2">
                          {pUrl ? (
                            <img
                              src={pUrl}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                              No photo
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-medium line-clamp-2">
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {person.character}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="mt-16 mb-8">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  to={`/${mediaType}/${item.id}`}
                  className="group block rounded-lg overflow-hidden bg-gray-900 hover:bg-gray-800 transition-all"
                >
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={posterUrl(item.poster_path, 'w342')!}
                      alt={item.title ?? item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-2">
                      {item.title ?? item.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Detail