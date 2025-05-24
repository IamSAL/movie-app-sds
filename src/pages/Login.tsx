import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilmIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const { currentUser, login, error } = useAuth();
  
  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };
  
  return (
    <motion.div 
      className="min-h-[80vh] flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div 
          className="inline-flex mb-4"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <FilmIcon className="h-12 w-12 text-primary-500" />
        </motion.div>
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Sign in to access your movie watchlist</p>
      </motion.div>
      
      <AuthForm 
        type="login" 
        onSubmit={handleLogin}
        error={error}
      />
      
      <motion.div 
        className="mt-8 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <p>
          For demo purposes, you can use:
          <br />
          Email: <span className="text-gray-300">demo@example.com</span>
          <br />
          Password: <span className="text-gray-300">password123</span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;