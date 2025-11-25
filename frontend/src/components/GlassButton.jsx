import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassButtonMUI = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3), // px-6 py-2
  backgroundColor: 'rgba(59, 130, 246, 0.2)', // bg-blue-500 bg-opacity-20
  backdropFilter: 'blur(12px)', // backdrop-filter backdrop-blur-lg
  border: '1px solid rgba(96, 165, 250, 0.2)', // border border-opacity-20 border-blue-400
  borderRadius: theme.shape.borderRadius, // rounded-lg
  color: theme.palette.common.white, // text-white
  fontWeight: theme.typography.fontWeightSemibold, // font-semibold
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.3)', // hover:bg-opacity-30
  },
  // focus:outline-none is handled by MUI default
  // focus:ring-2 focus:ring-blue-500 - Material-UI has its own focus styles.
  transition: 'all 300ms ease-in-out', // transition-all duration-300 ease-in-out
}));


const GlassButton = ({ children, className = '', ...props }) => {
  return (
    <GlassButtonMUI className={className} {...props}>
      {children}
    </GlassButtonMUI>
  );
};

export default GlassButton;