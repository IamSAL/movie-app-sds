import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import {GithubIcon} from "lucide-react"
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-black text-white">
      <Navbar />
      <motion.main 
        className="container mx-auto px-4 pt-20 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <footer className="py-6 bg-background-light bg-opacity-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} AGBO VERSE - By Russo Brothers</p>
          
            <a
            href="https://github.com/IamSAL/movie-app-sds"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 mt-2 text-gray-400 hover:text-white transition-colors"
            >
            <GithubIcon className="w-5 h-5" />
            <span>Demo By Salman</span>
            </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;