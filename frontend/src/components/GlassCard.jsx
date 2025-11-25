import React from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassCardMUI = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white bg-opacity-10
  backdropFilter: 'blur(12px)', // backdrop-filter backdrop-blur-lg
  border: '1px solid rgba(255, 255, 255, 0.2)', // border border-opacity-20 border-white
  borderRadius: theme.shape.borderRadius * 2, // rounded-xl (assuming theme.shape.borderRadius is 4px, 2*4=8px, xl is usually 12px-16px, adjust as needed)
  boxShadow: theme.shadows[5], // shadow-lg
  padding: theme.spacing(3), // p-6
  position: 'relative', // relative
  overflow: 'hidden', // overflow-hidden
}));

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <GlassCardMUI className={className} {...props}>
      {children}
    </GlassCardMUI>
  );
};

export default GlassCard;