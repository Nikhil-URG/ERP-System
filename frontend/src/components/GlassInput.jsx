import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    width: '100%', // w-full
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white bg-opacity-10
    borderRadius: theme.shape.borderRadius, // rounded-lg
    color: theme.palette.common.white, // text-white
    transition: 'all 300ms ease-in-out', // transition-all duration-300 ease-in-out
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid rgba(255, 255, 255, 0.2)', // border border-opacity-20 border-white
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.4) !important', // Adjust hover border
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main, // focus:ring-2 focus:ring-blue-500
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2), // px-4 py-2, adjusted for TextField's default padding
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(255, 255, 255, 0.7)', // placeholder-gray-300 (adjust for better contrast)
    opacity: 1, // Ensure placeholder is visible
  },
}));

const GlassInput = ({ className = '', ...props }) => {
  return (
    <GlassTextField
      className={className}
      variant="outlined"
      {...props}
    />
  );
};

export default GlassInput;
