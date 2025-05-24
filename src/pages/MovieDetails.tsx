import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import { movieApi, Movie, posterSizes, backdropSizes, watchlistService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MovieGrid from '../components/MovieGrid';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Fetch movie details and recommendations
  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [movieData, recommendationsData] = await Promise.all([
          movieApi.getMovieDetails(id),
          movieApi.getMovieRecommendations(id),
        ]);
        
        setMovie(movieData);
        setRecommendations(recommendationsData);
        
        // Check if movie is in watchlist
        if (currentUser) {
          const isInList = watchlistService.isInWatchlist(currentUser.email, Number(id));
          setIsInWatchlist(isInList);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieData();
    // Scroll to top when movie changes
    window.scrollTo(0, 0);
  }, [id, currentUser]);
  
  // Handle watchlist actions
  const handleWatchlistToggle = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!movie) return;
    
    if (isInWatchlist) {
      watchlistService.removeFromWatchlist(currentUser.email, movie.id);
      setIsInWatchlist(false);
    } else {
      watchlistService.addToWatchlist(currentUser.email, movie);
      setIsInWatchlist(true);
    }
  };
  
  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Calculate movie runtime in hours and minutes
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return 'Unknown';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours}h ${remainingMinutes}m`;
  };
  
  // Watchlist handlers for recommendations
  const handleAddToWatchlist = (movie: Movie) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    watchlistService.addToWatchlist(currentUser.email, movie);
    if (movie.id === Number(id)) {
      setIsInWatchlist(true);
    }
  };
  
  const handleRemoveFromWatchlist = (movieId: number) => {
    if (!currentUser) return;
    
    watchlistService.removeFromWatchlist(currentUser.email, movieId);
    if (movieId === Number(id)) {
      setIsInWatchlist(false);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If movie not found
  if (!movie) {
    return (
      <motion.div 
        className="min-h-[60vh] flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist or was removed.</p>
        <button 
          onClick={handleGoBack} 
          className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </motion.div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`movie-${id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Backdrop Image */}
        <div className="relative mb-8">
          {movie.backdrop_path && (
            <motion.div 
              className="w-full sm:h-[36vh] h-[10vh] overflow-hidden rounded-xl"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={`${backdropSizes.large}${movie.backdrop_path}`} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent" />
            </motion.div>
          )}
          
          {/* Back button */}
          <motion.button 
            onClick={handleGoBack}
            className="absolute top-4 left-4 z-10 flex items-center bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </motion.button>
        </div>
        
        {/* Movie Content */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mb-12">
          {/* Poster */}
          <motion.div 
            className="mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src={movie.poster_path ? `${posterSizes.large}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                alt={movie.title} 
                className="w-full h-auto"
              />
            </div>
          </motion.div>
          
          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
            
            {/* Movie Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              {movie.vote_average > 0 && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{movie.vote_average.toFixed(1)} ({movie.vote_count} votes)</span>
                </div>
              )}
              
              {movie.release_date && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-1" />
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
              )}
              
              {movie.runtime && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-1" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>
            
            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id} 
                      className="px-3 py-1 bg-background-light rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview || 'No overview available.'}</p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <motion.button 
                onClick={handleWatchlistToggle}
                className={`flex items-center px-5 py-2 rounded-full transition-colors ${
                  isInWatchlist 
                    ? 'bg-accent-600 hover:bg-accent-700 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`w-5 h-5 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <MovieGrid
              title="You Might Also Like"
              movies={recommendations}
              watchlistMovieIds={currentUser ? watchlistService.getWatchlist(currentUser.email).map(m => m.id) : []}
              onAddToWatchlist={handleAddToWatchlist}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieDetails;