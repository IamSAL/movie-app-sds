import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { movieApi, Movie, watchlistService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/HeroSection';
import MovieGrid from '../components/MovieGrid';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Load trending and now playing movies
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const [trending, nowPlaying] = await Promise.all([
          movieApi.getTrending(),
          movieApi.getNowPlaying(),
        ]);
        
        setTrendingMovies(trending);
        setNowPlayingMovies(nowPlaying);
        
        // Select a random featured movie from trending
        if (trending.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trending.length));
          setFeaturedMovie(trending[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  // Load watchlist if user is authenticated
  useEffect(() => {
    if (currentUser) {
      const watchlist = watchlistService.getWatchlist(currentUser.email);
      setWatchlistIds(watchlist.map(movie => movie.id));
    } else {
      setWatchlistIds([]);
    }
  }, [currentUser]);
  
  // Watchlist handlers
  const handleAddToWatchlist = (movie: Movie) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    watchlistService.addToWatchlist(currentUser.email, movie);
    setWatchlistIds(prev => [...prev, movie.id]);
  };
  
  const handleRemoveFromWatchlist = (movieId: number) => {
    if (!currentUser) return;
    
    watchlistService.removeFromWatchlist(currentUser.email, movieId);
    setWatchlistIds(prev => prev.filter(id => id !== movieId));
  };
  
  // Search form handler
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      {featuredMovie && !isLoading && (
        <HeroSection 
          movie={featuredMovie}
          isInWatchlist={watchlistIds.includes(featuredMovie.id)}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />
      )}
      
      {/* Search Bar */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              name="query"
              className="block w-full pl-10 pr-3 py-4 bg-background-light border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white"
              placeholder="Search for movies..."
              required
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-primary-600 hover:bg-primary-700 rounded-r-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </motion.div>
      
      {/* Movie Sections */}
      <div className="space-y-12">
        <MovieGrid
          title="Trending This Week"
          movies={trendingMovies}
          isLoading={isLoading}
          watchlistMovieIds={watchlistIds}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />
        
        <MovieGrid
          title="Now Playing"
          movies={nowPlayingMovies}
          isLoading={isLoading}
          watchlistMovieIds={watchlistIds}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />
      </div>
    </motion.div>
  );
};

export default Home;