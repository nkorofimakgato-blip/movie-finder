import type { TMDBDetail, TMDBResponse, MediaType } from '../types/tmdb'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const IMG_BASE = 'https://image.tmdb.org/t/p'
export const POSTER_SIZE = 'w500'
export const BACKDROP_SIZE = 'w1280'
export const PROFILE_SIZE = 'w185'

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`TMDB error ${res.status}: ${res.statusText}`)
  }
  return (await res.json()) as T
}

export async function searchMulti(query: string, page = 1): Promise<TMDBResponse> {
  return tmdbFetch<TMDBResponse>('/search/multi', {
    query,
    page: String(page),
    include_adult: 'false',
  })
}

export async function getTrending(): Promise<TMDBResponse> {
  return tmdbFetch<TMDBResponse>('/trending/all/week')
}

export async function getDetails(id: number, type: MediaType): Promise<TMDBDetail> {
  return tmdbFetch<TMDBDetail>(`/${type}/${id}`, {
    append_to_response: 'credits,similar',
  })
}

export function posterUrl(path: string | null, size = POSTER_SIZE): string | null {
  if (!path) return null
  return `${IMG_BASE}/${size}${path}`
}

export function backdropUrl(path: string | null, size = BACKDROP_SIZE): string | null {
  if (!path) return null
  return `${IMG_BASE}/${size}${path}`
}

export function profileUrl(path: string | null, size = PROFILE_SIZE): string | null {
  if (!path) return null
  return `${IMG_BASE}/${size}${path}`
}