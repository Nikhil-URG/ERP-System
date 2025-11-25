import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
  Grid,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import apiClient from '../api/client';

const GlassPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(3),
  color: theme.palette.common.white,
  position: 'relative',
  overflow: 'hidden',
}));

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userResponse = await apiClient.get('/user/me');
      setUser(userResponse.data);
      const attendanceResponse = await apiClient.get('/user/attendance/last10');
      setAttendance(attendanceResponse.data);
      const activeCheckIn = attendanceResponse.data.find(att => att.check_out === null);
      setIsCheckedIn(!!activeCheckIn);
    } catch (error) {
      console.error('Failed to fetch user data', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setSnackbarMessage('Error loading data. Please try logging in again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCheckIn = async () => {
    setButtonLoading(true);
    try {
      await apiClient.post('/user/attendance/check-in');
      setSnackbarMessage('Checked In!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await fetchUserData();
    } catch (error) {
      console.error('Check-in failed', error);
      setSnackbarMessage(error.response?.data?.detail || 'An error occurred during check-in.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setButtonLoading(true);
    try {
      await apiClient.post('/user/attendance/check-out');
      setSnackbarMessage('Checked Out!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      await fetchUserData();
    } catch (error) {
      console.error('Check-out failed', error);
      setSnackbarMessage(error.response?.data?.detail || 'An error occurred during check-out.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
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
        <CircularProgress size="lg" sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom right, #805AD5, #3182CE)',
        p: 2,
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: '80rem' }}> {/* maxW="5xl" approx */}
        <GlassPaper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">User Dashboard</Typography>
          <Button onClick={handleLogout} variant="outlined" color="error">
            Logout
          </Button>
        </GlassPaper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <GlassPaper sx={{ height: '100%' }}>
              <Typography variant="h6" component="h3" gutterBottom>Your Information</Typography>
              <Typography>Welcome, <Typography component="span" fontWeight="bold">{user.username}</Typography>!</Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Role: <Chip label={user.role} color={user.role === 'admin' ? 'secondary' : 'primary'} size="small" /></Typography>
            </GlassPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <GlassPaper sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h6" component="h3" gutterBottom>Time Tracking</Typography>
              <Button
                variant="contained"
                size="large"
                color={isCheckedIn ? 'warning' : 'success'}
                onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                disabled={buttonLoading}
                startIcon={buttonLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isCheckedIn ? 'Check Out' : 'Check In'}
              </Button>
            </GlassPaper>
          </Grid>
        </Grid>

        <GlassPaper>
          <Typography variant="h6" component="h3" gutterBottom>Last 10 Attendance Records</Typography>
          {attendance.length === 0 ? (
            <Typography textAlign="center">No attendance records found.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Check-In Time</TableCell>
                    <TableCell sx={{ color: 'white' }}>Check-Out Time</TableCell>
                    <TableCell align="right" sx={{ color: 'white' }}>Total Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.map((att) => (
                    <TableRow key={att.id}>
                      <TableCell>{new Date(att.check_in).toLocaleString()}</TableCell>
                      <TableCell>
                        {att.check_out ? (
                          new Date(att.check_out).toLocaleString()
                        ) : (
                          <Chip label="Active" size="small" color="info" />
                        )}
                      </TableCell>
                      <TableCell align="right">{att.total_hours ? att.total_hours.toFixed(2) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </GlassPaper>
      </Stack>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDashboard;