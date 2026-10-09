export interface TMDBItem {
  id: number
  media_type?: 'movie' | 'tv' | 'person'
  title?: string          // movies
  name?: string           // TV shows
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string    // movies
  first_air_date?: string  // tv
  vote_average: number
  vote_count: number
}

export interface TMDBResponse {
  page: number
  results: TMDBItem[]
  total_pages: number
  total_results: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBCast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TMDBDetail extends TMDBItem {
  genres: TMDBGenre[]
  runtime?: number
  number_of_seasons?: number
  tagline?: string
  status: string
  credits?: {
    cast: TMDBCast[]
  }
  similar?: TMDBResponse
}

export type MediaType = 'movie' | 'tv'