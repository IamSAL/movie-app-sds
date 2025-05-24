import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <motion.div 
      className="min-h-[80vh] flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-8xl font-bold text-primary-500">404</h1>
      </motion.div>
      
      <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/" 
            className="flex items-center px-5 py-2 bg-primary-600 hover:bg-primary-700 rounded-full text-white transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/search" 
            className="flex items-center px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Movies
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;