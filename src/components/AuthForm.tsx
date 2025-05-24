import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  error: string | null;
}

const AuthForm = ({ type, onSubmit, error }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(email, password);
      navigate(type === 'login' ? '/' : '/login');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-6 bg-background-card rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        {type === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
      </h2>
      
      {error && (
        <motion.div 
          className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-md flex items-start"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-background-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white"
              placeholder="your.email@example.com"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-background-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        </div>
        
        <motion.button
          type="submit"
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {isSubmitting
            ? 'Processing...'
            : type === 'login'
              ? 'Sign In'
              : 'Create Account'}
        </motion.button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        {type === 'login' ? (
          <p className="text-gray-400">
            Don't have an account?{' '}
            <motion.a
              href="/signup"
              className="text-primary-400 hover:text-primary-300 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Sign up
            </motion.a>
          </p>
        ) : (
          <p className="text-gray-400">
            Already have an account?{' '}
            <motion.a
              href="/login"
              className="text-primary-400 hover:text-primary-300 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Sign in
            </motion.a>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AuthForm;