import React, { useState } from 'react';
import SpinnerIcon from './SpinnerIcon';

interface LoginScreenProps {
  onAuth: (mode: 'login' | 'signup', email: string, password: string) => Promise<boolean>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setError(null);
    setIsLoading(true);
    const success = await onAuth(mode, email, password);
    if (!success) {
      setError(mode === 'login' ? 'Invalid credentials. Please try again or sign up.' : 'This email is already in use. Please log in.');
    }
    setIsLoading(false);
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Lead Finder <span className="text-blue-400">AirTech</span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-400 max-w-2xl">
          {mode === 'login' 
            ? 'Log in to access your saved prospecting profiles.' 
            : 'Create an account to start finding leads.'}
        </p>
      </div>
      
      <div className="mt-10 w-full max-w-sm p-8 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/30 border border-red-700 p-2 rounded-md">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
            disabled={isLoading}
          >
            {isLoading && <SpinnerIcon className="w-5 h-5 mr-3" />}
            {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleMode} className="ml-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginScreen;