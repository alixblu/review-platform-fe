import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ size = 'md', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const Spinner = () => (
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <Spinner />
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-neutral-600 font-medium"
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Spinner />
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-neutral-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const LoadingSkeleton = ({ className = '', count = 1 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className={`bg-neutral-200 rounded ${className}`}></div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-soft border border-neutral-100 animate-pulse ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/6"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-neutral-200 rounded"></div>
        <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
      </div>
      <div className="mt-4 h-48 bg-neutral-200 rounded-xl"></div>
    </div>
  );
};

export default Loading;

