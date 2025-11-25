import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Link,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import apiClient from '../api/client';

const GlassBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: theme.spacing(50), // maxW="md" approx
}));

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/signup', { username, email, password, full_name: fullName });
      setSnackbarMessage('Account created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/login');
    } catch (err) {
      setSnackbarMessage(err.response?.data?.detail || 'An error occurred during signup.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom right, #38A169, #319795)', // bgGradient="linear(to-br, #38A169, #319795)"
      }}
    >
      <GlassBox>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1" textAlign="center" color="white">
            Sign Up
          </Typography>
          <form onSubmit={handleSignup}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& label': { color: 'rgba(255, 255, 255, 0.8)' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#68D391' },
                  },
                }}
              />
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& label': { color: 'rgba(255, 255, 255, 0.8)' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#68D391' },
                  },
                }}
              />
              <TextField
                label="Full Name (Optional)"
                variant="outlined"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={{
                  '& label': { color: 'rgba(255, 255, 255, 0.8)' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#68D391' },
                  },
                }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& label': { color: 'rgba(255, 255, 255, 0.8)' },
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.6) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#68D391' },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  mt: 2,
                  backgroundColor: '#38A169',
                  '&:hover': { backgroundColor: '#2F855A' },
                  color: 'white',
                }}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </Stack>
          </form>
          <Typography textAlign="center" color="white">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" color="inherit" sx={{ textDecoration: 'underline' }}>
              Login
            </Link>
          </Typography>
        </Stack>
      </GlassBox>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;