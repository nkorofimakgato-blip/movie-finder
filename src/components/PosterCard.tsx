import { Link } from 'react-router-dom'
import type { TMDBItem, MediaType } from '../types/tmdb'
import { posterUrl } from '../api/tmdb'

interface PosterCardProps {
  item: TMDBItem
  type?: MediaType
}

function PosterCard({ item, type }: PosterCardProps) {
  // Determine media type — search results include `media_type`, but
  // trending items also include it.
  const mediaType: MediaType = (item.media_type as MediaType) ?? type ?? 'movie'
  const title = item.title ?? item.name ?? 'Untitled'
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)
  const poster = posterUrl(item.poster_path, 'w342')

  return (
    <Link
      to={`/${mediaType}/${item.id}`}
      className="group block rounded-lg overflow-hidden bg-gray-900 hover:bg-gray-800 transition-all"
    >
      <div className="aspect-[2/3] bg-gray-800 overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm p-4 text-center">
            {title}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-amber-400 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{year}</span>
          <span className="flex items-center gap-1">
            ⭐ {item.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PosterCard