import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;


const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});


export const posterSizes = {
  small: `${IMAGE_BASE_URL}/w154`,
  medium: `${IMAGE_BASE_URL}/w342`,
  large: `${IMAGE_BASE_URL}/w500`,
  original: `${IMAGE_BASE_URL}/original`,
};

export const backdropSizes = {
  small: `${IMAGE_BASE_URL}/w300`,
  medium: `${IMAGE_BASE_URL}/w780`,
  large: `${IMAGE_BASE_URL}/w1280`,
  original: `${IMAGE_BASE_URL}/original`,
};

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
}

export interface SearchResults {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Movie API endpoints
export const movieApi = {
  // Get trending movies
  getTrending: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get<SearchResults>('/trending/movie/week');
    return response.data.results;
  },
  
  // Get now playing movies
  getNowPlaying: async (): Promise<Movie[]> => {
    const response = await tmdbApi.get<SearchResults>('/movie/now_playing');
    return response.data.results;
  },
  
  // Search movies by query
  searchMovies: async (query: string, page = 1): Promise<SearchResults> => {
    const response = await tmdbApi.get<SearchResults>('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },
  
  // Get movie details
  getMovieDetails: async (id: number | string): Promise<Movie> => {
    const response = await tmdbApi.get<Movie>(`/movie/${id}`);
    return response.data;
  },
  
  // Get movie recommendations
  getMovieRecommendations: async (id: number | string): Promise<Movie[]> => {
    const response = await tmdbApi.get<SearchResults>(`/movie/${id}/recommendations`);
    return response.data.results;
  },
};

// Storage for watchlist (using localStorage in this prototype)
export const watchlistService = {
  getWatchlist: (userId: string): Movie[] => {
    const storedWatchlist = localStorage.getItem(`watchlist_${userId}`);
    return storedWatchlist ? JSON.parse(storedWatchlist) : [];
  },
  
  addToWatchlist: (userId: string, movie: Movie): void => {
    const watchlist = watchlistService.getWatchlist(userId);
    // Check if movie already exists in watchlist
    if (!watchlist.some((m) => m.id === movie.id)) {
      const updatedWatchlist = [...watchlist, movie];
      localStorage.setItem(`watchlist_${userId}`, JSON.stringify(updatedWatchlist));
    }
  },
  
  removeFromWatchlist: (userId: string, movieId: number): void => {
    const watchlist = watchlistService.getWatchlist(userId);
    const updatedWatchlist = watchlist.filter((movie) => movie.id !== movieId);
    localStorage.setItem(`watchlist_${userId}`, JSON.stringify(updatedWatchlist));
  },
  
  isInWatchlist: (userId: string, movieId: number): boolean => {
    const watchlist = watchlistService.getWatchlist(userId);
    return watchlist.some((movie) => movie.id === movieId);
  },
};