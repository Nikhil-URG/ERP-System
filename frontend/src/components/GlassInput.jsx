import React from 'react';

const GlassInput = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 bg-white bg-opacity-10 border border-opacity-20 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300 transition-all duration-300 ease-in-out ${className}`}
      {...props}
    />
  );
};

export default GlassInput;
