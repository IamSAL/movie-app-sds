import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { Movie, watchlistService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MovieGrid from '../components/MovieGrid';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Load watchlist for current user
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);

     watchlistService.getWatchlist(currentUser.id).then(res => {
            setWatchlist(res);
          })
    setIsLoading(false);
  }, [currentUser, navigate]);
  
  // Handle remove from watchlist
  const handleRemoveFromWatchlist = (movieId: number) => {
    if (!currentUser) return;
    
    watchlistService.removeFromWatchlist(currentUser.id, movieId);
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
  };
  
  // Clear entire watchlist
  const handleClearWatchlist = () => {
    if (!currentUser) return;
    
    // Simple confirmation
    const confirmed = window.confirm('Are you sure you want to clear your entire watchlist?');
    if (!confirmed) return;
    
    // Clear watchlist in localStorage
    localStorage.setItem(`watchlist_${currentUser.id}`, JSON.stringify([]));
    setWatchlist([]);
  };
  
  return (
    <motion.div
      className="min-h-[80vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap justify-between items-center mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="w-6 h-6 mr-2 text-accent-500" />
            My Watchlist
          </h1>
          <p className="text-gray-400 mt-1">
            Keep track of movies you want to watch
          </p>
        </motion.div>
        
        {watchlist.length > 0 && (
          <motion.button
            onClick={handleClearWatchlist}
            className="flex items-center px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Watchlist
          </motion.button>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        {watchlist.length === 0 && !isLoading ? (
          <motion.div 
            className="bg-background-card bg-opacity-50 rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-6">
              Browse movies and add them to your watchlist to keep track of what you want to watch.
            </p>
            <motion.button
              onClick={() => navigate('/search')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Movies to Watch
            </motion.button>
          </motion.div>
        ) : (
          <MovieGrid
            movies={watchlist}
            isLoading={isLoading}
            watchlistMovieIds={watchlist.map(movie => movie.id)}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Watchlist;