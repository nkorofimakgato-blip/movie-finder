import type { TMDBItem, MediaType } from '../types/tmdb'

const KEY = 'movie-finder-favorites'

export interface Favorite {
  id: number
  media_type: MediaType
  title: string
  poster_path: string | null
  vote_average: number
  savedAt: number
}

export function getFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Favorite[]
  } catch {
    return []
  }
}

export function isFavorite(id: number): boolean {
  return getFavorites().some((f) => f.id === id)
}

export function addFavorite(item: TMDBItem, mediaType: MediaType): void {
  const list = getFavorites()
  if (list.some((f) => f.id === item.id)) return

  list.unshift({
    id: item.id,
    media_type: mediaType,
    title: item.title ?? item.name ?? 'Untitled',
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    savedAt: Date.now(),
  })
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function removeFavorite(id: number): void {
  const list = getFavorites().filter((f) => f.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function toggleFavorite(item: TMDBItem, mediaType: MediaType): boolean {
  if (isFavorite(item.id)) {
    removeFavorite(item.id)
    return false
  }
  addFavorite(item, mediaType)
  return true
}