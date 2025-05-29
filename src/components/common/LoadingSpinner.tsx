import React from 'react';
import { Spinner } from '@heroui/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  message = 'Loading...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Spinner size={size} color="primary" className="mb-4" />
      {message && <p className="text-default-500">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
