import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { movieApi, Movie, SearchResults, watchlistService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MovieGrid from '../components/MovieGrid';

const Search = () => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Get search query from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q');
    
    if (query) {
      setSearchQuery(query);
      searchMovies(query, 1);
    } else {
      setSearchResults([]);
      setTotalResults(0);
      setTotalPages(0);
    }
  }, [location.search]);
  
  // Load watchlist if user is authenticated
  useEffect(() => {
    if (currentUser) {
      const watchlist = watchlistService.getWatchlist(currentUser.uid);
      setWatchlistIds(watchlist.map(movie => movie.id));
    } else {
      setWatchlistIds([]);
    }
  }, [currentUser]);


  
  
  // Search movies function
  const searchMovies = async (query: string, page: number) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const results: SearchResults = await movieApi.searchMovies(query, page);
      
      if (page === 1) {
        setSearchResults(results.results);
      } else {
        setSearchResults(prev => [...prev, ...results.results]);
      }
      
      setTotalResults(results.total_results);
      setTotalPages(results.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      // The effect hook will handle the actual search
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    navigate('/search');
  };
  
  // Load more results
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      searchMovies(searchQuery, currentPage + 1);
    }
  };
  
  // Watchlist handlers
  const handleAddToWatchlist = (movie: Movie) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    watchlistService.addToWatchlist(currentUser.uid, movie);
    setWatchlistIds(prev => [...prev, movie.id]);
  };
  
  const handleRemoveFromWatchlist = (movieId: number) => {
    if (!currentUser) return;
    
    watchlistService.removeFromWatchlist(currentUser.uid, movieId);
    setWatchlistIds(prev => prev.filter(id => id !== movieId));
  };
  
  return (
    <motion.div
      className="min-h-[80vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search Form */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              name="query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-12 py-4 bg-background-light border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white"
              placeholder="Search for movies..."
              required
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-12 flex items-center px-3 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-primary-600 hover:bg-primary-700 rounded-r-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </motion.div>
      
      {/* Results */}
      {searchQuery && (
        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            {isLoading && currentPage === 1 
              ? 'Searching...' 
              : `Found ${totalResults} results for "${searchQuery}"`}
          </h1>
        </div>
      )}
      
      {/* Movie Grid */}
      <MovieGrid
        movies={searchResults}
        isLoading={isLoading && currentPage === 1}
        watchlistMovieIds={watchlistIds}
        onAddToWatchlist={handleAddToWatchlist}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
      />
      
      {/* Load More Button */}
      {searchResults.length > 0 && currentPage < totalPages && (
        <div className="mt-8 text-center">
          <motion.button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-background-light hover:bg-gray-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Results'}
          </motion.button>
        </div>
      )}
      
      {/* No Results Message */}
      {searchQuery && !isLoading && searchResults.length === 0 && (
        <motion.div
          className="text-center py-16 bg-background-card bg-opacity-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xl text-gray-400">No movies found for "{searchQuery}"</p>
          <p className="mt-2 text-gray-500">Try a different search term.</p>
        </motion.div>
      )}
      
      {/* Initial State - No Search */}
      {!searchQuery && !isLoading && searchResults.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xl text-gray-400">Enter a movie title to search</p>
          <p className="mt-2 text-gray-500">Discover new movies or find your favorites.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Search;