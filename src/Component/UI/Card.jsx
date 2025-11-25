import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-2xl shadow-soft border border-neutral-100 transition-all duration-200';
  
  const hoverStyles = hover ? 'hover:shadow-medium hover:-translate-y-1 cursor-pointer' : '';
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  } : {};
  
  return (
    <CardComponent
      className={`${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-neutral-100 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-neutral-100 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;

