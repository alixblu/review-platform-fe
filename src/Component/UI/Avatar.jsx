import React from 'react';
import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  status,
  className = '',
  onClick,
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-6 h-6',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-neutral-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  const AvatarComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  } : {};

  return (
    <AvatarComponent
      onClick={onClick}
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''}`}
      {...motionProps}
      {...props}
    >
      <img
        src={src || 'https://via.placeholder.com/150'}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover border-2 border-neutral-100 ${className}`}
      />
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-white`}
        />
      )}
    </AvatarComponent>
  );
};

export const AvatarGroup = ({ 
  avatars = [], 
  max = 3, 
  size = 'md',
  className = '' 
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayAvatars.map((avatar, idx) => (
        <div key={idx} className="relative">
          <img
            src={avatar.src || 'https://via.placeholder.com/150'}
            alt={avatar.alt || `Avatar ${idx + 1}`}
            className={`${sizes[size]} rounded-full object-cover border-2 border-white`}
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`${sizes[size]} rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center font-semibold text-neutral-600`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;

