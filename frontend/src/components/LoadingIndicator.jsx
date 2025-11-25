import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingIndicator = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress color="primary" />
    </Box>
  );
};

export default LoadingIndicator;