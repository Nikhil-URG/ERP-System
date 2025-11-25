import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white rounded-xl shadow-lg p-6 relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
