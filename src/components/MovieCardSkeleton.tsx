import React from 'react';
import { motion } from 'framer-motion';

interface MovieCardSkeletonProps {
  delay?: number;
}

const MovieCardSkeleton = ({ delay = 0 }: MovieCardSkeletonProps) => {
  return (
    <motion.div 
      className="rounded-lg bg-background-card shadow-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      {/* Poster skeleton */}
      <div className="aspect-[2/3] bg-gray-800 animate-pulse-slow" />
      
      {/* Content skeleton */}
      <div className="p-4">
        <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse-slow mb-2" />
        <div className="h-4 w-1/3 bg-gray-700 rounded animate-pulse-slow" />
      </div>
    </motion.div>
  );
};

export default MovieCardSkeleton;