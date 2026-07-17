import React from 'react';
import logo from '../assets/logo.png';

export default function Logo({ color = 'currentColor', className = '' }) {
  return (
    <img src={logo} alt="Milevia" width={80} height={80} />
    // <svg
    //   viewBox="0 0 44 44"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    //   width={size}
    //   height={size}
    //   className={className}
    // >
    //   <path
    //     d="M 6,28 L 13,15 L 20,28 L 27,15 L 34,28 L 41,12"
    //     stroke={color}
    //     strokeWidth="3"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M 32,12 L 41,12 L 41,21"
    //     stroke={color}
    //     strokeWidth="3"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    // </svg>
  );
}
