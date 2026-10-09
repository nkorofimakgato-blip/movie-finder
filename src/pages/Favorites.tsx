import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../lib/favorites'
import { posterUrl } from '../api/tmdb'

function Favorites() {
  const [favorites, setFavorites] = useState(getFavorites())

  function handleRemove(id: number) {
    removeFavorite(id)
    setFavorites(getFavorites())
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🎬</p>
        <h1 className="text-2xl font-bold mb-3">No favorites yet</h1>
        <p className="text-gray-400 mb-8">
          Tap the ☆ Add to favorites button on any movie or show to save it here.
        </p>
        <Link
          to="/"
          className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Browse trending
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-8">
        Your favorites ({favorites.length})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {favorites.map((fav) => {
          const poster = posterUrl(fav.poster_path, 'w342')
          return (
            <div
              key={fav.id}
              className="group relative rounded-lg overflow-hidden bg-gray-900"
            >
              <Link to={`/${fav.media_type}/${fav.id}`} className="block">
                <div className="aspect-[2/3] bg-gray-800 overflow-hidden">
                  {poster ? (
                    <img
                      src={poster}
                      alt={fav.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm p-4 text-center">
                      {fav.title}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-amber-400 transition-colors">
                    {fav.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    ⭐ {fav.vote_average.toFixed(1)}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => handleRemove(fav.id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center text-sm transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove from favorites"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Favorites