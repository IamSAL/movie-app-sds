import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../services/api';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  watchlistMovieIds?: number[];
  onAddToWatchlist?: (movie: Movie) => void;
  onRemoveFromWatchlist?: (movieId: number) => void;
  title?: string;
}

const MovieGrid = ({
  movies,
  isLoading = false,
  watchlistMovieIds = [],
  onAddToWatchlist,
  onRemoveFromWatchlist,
  title,
}: MovieGridProps) => {
  // Show skeletons while loading
  if (isLoading) {
    return (
      <div>
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeleton key={index} delay={index} />
          ))}
        </div>
      </div>
    );
  }
  
  // Show message if no movies
  if (movies.length === 0) {
    return (
      <div>
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <motion.div
          className="text-center py-16 bg-background-card bg-opacity-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xl text-gray-400">No movies found</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <MovieCard
              movie={movie}
              isInWatchlist={watchlistMovieIds.includes(movie.id)}
              onAddToWatchlist={onAddToWatchlist}
              onRemoveFromWatchlist={onRemoveFromWatchlist}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MovieGrid;