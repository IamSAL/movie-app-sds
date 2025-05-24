import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Heart } from 'lucide-react';
import { Movie, backdropSizes } from '../services/api';

interface HeroSectionProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onAddToWatchlist?: (movie: Movie) => void;
  onRemoveFromWatchlist?: (movieId: number) => void;
}

const HeroSection = ({
  movie,
  isInWatchlist = false,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}: HeroSectionProps) => {
  const backdropUrl = movie.backdrop_path 
    ? `${backdropSizes.large}${movie.backdrop_path}`
    : null;
    
  const handleWatchlistClick = () => {
    if (isInWatchlist && onRemoveFromWatchlist) {
      onRemoveFromWatchlist(movie.id);
    } else if (onAddToWatchlist) {
      onAddToWatchlist(movie);
    }
  };
  
  return (
    <motion.div 
      className="relative w-full h-[60vh] min-h-[400px] mb-12 overflow-hidden rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Backdrop Image */}
      {backdropUrl && (
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
        >
          <img 
            src={backdropUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent" />
        </motion.div>
      )}
      
      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="max-w-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {movie.title}
            </motion.h1>
            
            <motion.div 
              className="flex items-center space-x-4 mb-4 text-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>
                {movie.release_date 
                  ? new Date(movie.release_date).getFullYear() 
                  : 'Unknown'}
              </span>
            </motion.div>
            
            <motion.p 
              className="text-gray-300 mb-6 line-clamp-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {movie.overview}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Link to={`/movie/${movie.id}`}>
                <motion.button 
                  className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  More Details
                </motion.button>
              </Link>
              
              {(onAddToWatchlist || onRemoveFromWatchlist) && (
                <motion.button 
                  onClick={handleWatchlistClick}
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
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;