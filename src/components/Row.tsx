import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { TMDBItem, MediaType } from '../types/tmdb'
import PosterCard from './PosterCard'

interface RowProps {
  title: string
  items: TMDBItem[]
  mediaType?: MediaType
  showMeta?: boolean
  viewAllHref?: string
}

function Row({ title, items, mediaType, showMeta, viewAllHref }: RowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(direction: 'left' | 'right') {
    if (!scrollerRef.current) return
    const amount = scrollerRef.current.clientWidth * 0.8
    scrollerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (!items || items.length === 0) return null

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {title}
          </h2>
          {viewAllHref && (
            <Link
              to={viewAllHref}
              className="text-xs text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-full font-medium transition-colors"
            >
              View All →
            </Link>
          )}
        </div>

        {/* Arrow buttons */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scrollBy('left')}
            className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 hover:border-amber-400/50 hover:bg-gray-800 flex items-center justify-center text-gray-300 transition-colors"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scrollBy('right')}
            className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 hover:border-amber-400/50 hover:bg-gray-800 flex items-center justify-center text-gray-300 transition-colors"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={`${item.media_type ?? mediaType ?? 'movie'}-${item.id}`}
            className="flex-shrink-0 w-[140px] sm:w-[160px]"
          >
            <PosterCard item={item} type={mediaType} showMeta={showMeta} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Row
