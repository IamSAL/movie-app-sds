import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Info } from 'lucide-react';
import { Movie, posterSizes } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onAddToWatchlist?: (movie: Movie) => void;
  onRemoveFromWatchlist?: (movieId: number) => void;
}

const MovieCard = ({
  movie,
  isInWatchlist = false,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}: MovieCardProps) => {
  const { currentUser } = useAuth();
  const placeholder = `https://placehold.co/342x513?text=${movie.title?.split(' ').join('+')}`
  const posterUrl = movie.poster_path 
    ? `${posterSizes.medium}${movie.poster_path}`
    :placeholder ;
  
  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWatchlist && onRemoveFromWatchlist) {
      onRemoveFromWatchlist(movie.id);
    } else if (onAddToWatchlist) {
      onAddToWatchlist(movie);
    }
  };
  
  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg bg-background-card shadow-lg"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/movie/${movie.id}`} className="block h-full">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <motion.img
            onError={(e) => {
              e.currentTarget.src = placeholder;
            }}
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Rating */}
          <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
          </div>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-medium truncate group-hover:text-primary-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-400">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown year'}
          </p>
        </div>
        
        {/* Hover actions */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          initial={{ y: '100%' }}
          whileHover={{ y: 0 }}
        >
          <div className="flex justify-between items-center">
            <Link 
              to={`/movie/${movie.id}`}
              className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-full text-sm transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Details</span>
            </Link>
            
            {currentUser && (
              <motion.button
                onClick={handleWatchlistClick}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                  isInWatchlist 
                    ? 'bg-accent-600 hover:bg-accent-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
                <span>{isInWatchlist ? 'Added' : 'Watchlist'}</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;