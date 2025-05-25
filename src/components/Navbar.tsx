import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FilmIcon, Heart, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LogoImage from "../assets/russo-logo.png";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background-dark bg-opacity-90 shadow-lg backdrop-blur-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-display font-bold text-white"
          >
            <motion.div
              whileHover={{ rotate: 0.1, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* <img src={LogoImage} alt="RUSSO Verse" className="h-8 w-auto" /> */}
                <h1
                  className="uppercase font-extrabold font-mono text-[26px] tracking-widest text-transparent"
                  style={{
                    WebkitTextStroke: '1.5px white',
                    stroke: '1.5px white',
                    textShadow: 'none',
                  }}
                >
                  RUSSOVERSE
                </h1>
            </motion.div>
         
            
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/search">
              <Search className="h-5 w-5 mr-1" />
              Search
            </NavLink>
            
            {currentUser && (
              <NavLink to="/watchlist">
                <Heart className="h-5 w-5 mr-1" />
                Watchlist
              </NavLink>
            )}
            
            {currentUser ? (
              <motion.button
                onClick={handleLogout}
                className="flex items-center text-gray-300 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </motion.button>
            ) : (
              <NavLink to="/login">
                <LogIn className="h-5 w-5 mr-1" />
                Login
              </NavLink>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-background-dark bg-opacity-95 backdrop-blur-sm"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <MobileNavLink to="/search" icon={<Search className="h-5 w-5" />}>
                Search
              </MobileNavLink>
              
              {currentUser && (
                <MobileNavLink to="/watchlist" icon={<Heart className="h-5 w-5" />}>
                  Watchlist
                </MobileNavLink>
              )}
              
              {currentUser ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-left text-gray-300 hover:bg-background-light hover:text-white rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              ) : (
                <MobileNavLink to="/login" icon={<LogIn className="h-5 w-5" />}>
                  Login
                </MobileNavLink>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Desktop NavLink
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center hover:text-white transition-colors ${
        isActive ? 'text-white font-medium' : 'text-gray-300'
      }`}
    >
      {children}
    </Link>
  );
};

// Mobile NavLink
const MobileNavLink = ({ 
  to, 
  icon, 
  children 
}: { 
  to: string; 
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-primary-700 bg-opacity-30 text-white font-medium' 
          : 'text-gray-300 hover:bg-background-light hover:text-white'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
};

export default Navbar;