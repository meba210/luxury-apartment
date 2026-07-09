import React from 'react';

export default function Logo({ size = 32, color = 'currentColor', className = '' }) {
  return (
    <svg 
      viewBox="0 0 44 44" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size}
      className={className}
    >
      <path 
        d="M 6,28 L 13,15 L 20,28 L 27,15 L 34,28 L 41,12" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M 32,12 L 41,12 L 41,21" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
