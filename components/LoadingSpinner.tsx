
import React from 'react';

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-white">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium tracking-wide">{message}</p>
      <p className="mt-1 text-sm text-gray-400">This may take a moment...</p>
    </div>
  );
};

export default LoadingSpinner;
