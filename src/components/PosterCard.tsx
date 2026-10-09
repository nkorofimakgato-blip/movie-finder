import { Link } from 'react-router-dom'
import type { TMDBItem, MediaType } from '../types/tmdb'
import { posterUrl } from '../api/tmdb'

interface PosterCardProps {
  item: TMDBItem
  type?: MediaType
  showMeta?: boolean // show date + quality badges
}

function PosterCard({ item, type, showMeta = false }: PosterCardProps) {
  const mediaType: MediaType = (item.media_type as MediaType) ?? type ?? 'movie'
  const title = item.title ?? item.name ?? 'Untitled'
  const dateStr = item.release_date ?? item.first_air_date ?? ''
  const poster = posterUrl(item.poster_path, 'w342')

  const rating = item.vote_average ?? 0
  const ratingColor =
    rating >= 7
      ? 'text-green-400'
      : rating >= 5
        ? 'text-amber-400'
        : 'text-red-400'

  // Fake "quality" badge — real streaming sites use HD/CAM/SD tags
  // We'll show HD for most, CAM for very recent releases (< 30 days)
  const daysOld = dateStr
    ? (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
    : 999
  const quality = daysOld < 30 ? 'CAM' : 'HD'
  const qualityColor = quality === 'HD' ? 'bg-red-600' : 'bg-amber-500'

  // Short date like "16 Sep"
  const dateLabel = dateStr
    ? new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      })
    : ''

  return (
    <Link
      to={`/${mediaType}/${item.id}`}
      className="group block w-full rounded-lg overflow-hidden bg-gray-900 border border-gray-800/50 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="aspect-[2/3] bg-gray-800 overflow-hidden relative">
        {poster ? (
          <>
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />

            {/* Bottom info strip (always visible, streaming-style) */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-8 pb-2 px-2">
              <h3 className="text-xs font-semibold line-clamp-2 text-white leading-tight">
                {title}
              </h3>
              {showMeta && dateLabel && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {title} ({dateStr.slice(0, 4)})
                </p>
              )}
            </div>

            {/* Top-left: date OR media type */}
            {showMeta && dateLabel ? (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                {dateLabel}
              </div>
            ) : (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-black/80 text-gray-300">
                {mediaType === 'tv' ? 'TV' : 'Film'}
              </div>
            )}

            {/* Top-right: quality badge (if showMeta) or rating */}
            {showMeta ? (
              <div
                className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${qualityColor} text-white`}
              >
                {quality}
              </div>
            ) : rating > 0 ? (
              <div
                className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 ${ratingColor}`}
              >
                ⭐ {rating.toFixed(1)}
              </div>
            ) : null}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs p-2 text-center">
            {title}
          </div>
        )}
      </div>
    </Link>
  )
}

export default PosterCard