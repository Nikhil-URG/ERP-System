import React from 'react';

const GlassButton = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-6 py-2 bg-blue-500 bg-opacity-20 backdrop-filter backdrop-blur-lg border border-opacity-20 border-blue-400 rounded-lg text-white font-semibold hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
