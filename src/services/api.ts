import axios from 'axios';
import { supabase } from './supbase';

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

// Storage for watchlist (using Supabase)
export const watchlistService = {
  getWatchlist: async (userId: string): Promise<Movie[]> => {
    const { data, error } = await supabase
      .from('watchlist')
      .select('movie_data')
      .eq('user_id', userId);
    if (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
    console.log({data})
  
    return data ? data.map((item: any) => item.movie_data) : [];
  },

  addToWatchlist: async (userId: string, movie: Movie): Promise<void> => {
    console.log("adding",userId,movie.id)
    const { data: existing, error: checkError } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', movie.id)
      .maybeSingle();
    if (checkError) {
      console.error('Error checking watchlist:', checkError);
      return;
    }
    if (!existing) {
      const { error } = await supabase
        .from('watchlist')
        .insert({ user_id: userId, movie_id: movie.id, movie_data: movie });
      if (error) {
        console.error('Error adding to watchlist:', error);
      }
    }
     console.log("added", userId, movie.id);
  },

  removeFromWatchlist: async (userId: string, movieId: number): Promise<void> => {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', movieId);
    if (error) {
      console.error('Error removing from watchlist:', error);
    }
  },

  isInWatchlist: async (userId: string, movieId: number): Promise<boolean> => {
    const { data, error } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', userId)
      .eq('movie_id', movieId)
      .maybeSingle();
    if (error) {
      console.error('Error checking watchlist:', error);
      return false;
    }
    return !!data;
  },
};