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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post(
        '/auth/login',
        new URLSearchParams({ username, password }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      localStorage.setItem('token', response.data.access_token);
      setSnackbarMessage('Login Successful');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/dashboard');
    } catch (err) {
      setSnackbarMessage('Invalid username or password');
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
        background: 'linear-gradient(to bottom right, #805AD5, #3182CE)',
      }}
    >
      <GlassBox>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1" textAlign="center" color="white">
            Login
          </Typography>
          <form onSubmit={handleLogin}>
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
                    '&.Mui-focused fieldset': { borderColor: '#90CDF4' },
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
                    '&.Mui-focused fieldset': { borderColor: '#90CDF4' },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  mt: 2,
                  backgroundColor: '#3182CE',
                  '&:hover': { backgroundColor: '#2B6CB0' },
                  color: 'white',
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Stack>
          </form>
          <Typography textAlign="center" color="white">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" color="inherit" sx={{ textDecoration: 'underline' }}>
              Sign up
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

export default Login;