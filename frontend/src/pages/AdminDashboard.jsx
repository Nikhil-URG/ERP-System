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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

const UserModal = ({ isOpen, onClose, user, onSave, isLoading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('warning');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setFullName(user.full_name || '');
      setRole(user.role);
    } else {
      setUsername('');
      setEmail('');
      setFullName('');
      setRole('user');
      setPassword('');
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!username || !email || !role || (!user && !password)) {
        setSnackbarMessage("Please fill in all required fields.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
    }
    onSave({ id: user?.id, username, email, full_name: fullName, role, password: password || undefined });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} PaperComponent={GlassPaper} PaperProps={{ sx: { maxWidth: 'sm' } }}>
      <DialogTitle>
        {user ? 'Edit User' : 'Create User'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <FormControl fullWidth required>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={`Password ${user ? '(Leave blank to keep current)' : ''}`}
            variant="outlined"
            type="password"
            fullWidth
            required={!user}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
        </Button>
      </DialogActions>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

const AttendanceModal = ({ isOpen, onClose, userId, username }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  useEffect(() => {
    if (isOpen && userId) {
      setFetchLoading(true);
      apiClient.get(`/admin/users/${userId}/attendance`)
        .then(response => {
          setAttendanceRecords(response.data);
        })
        .catch(error => {
          console.error(`Failed to fetch attendance for user ${userId}`, error);
          setSnackbarMessage(error.response?.data?.detail || "Could not load attendance records.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        })
        .finally(() => {
          setFetchLoading(false);
        });
    }
  }, [isOpen, userId]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth PaperComponent={GlassPaper}>
      <DialogTitle>
        Attendance for {username}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {fetchLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size="lg" />
          </Box>
        ) : attendanceRecords.length === 0 ? (
          <Typography textAlign="center" sx={{ p: 4 }}>No attendance records found for this user.</Typography>
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
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.check_in).toLocaleString()}</TableCell>
                    <TableCell>
                      {record.check_out ? new Date(record.check_out).toLocaleString() : <Chip label="Active" size="small" color="info" />}
                    </TableCell>
                    <TableCell align="right">{record.total_hours ? record.total_hours.toFixed(2) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const [currentUserForEdit, setCurrentUserForEdit] = useState(null);
  const [selectedUserIdForAttendance, setSelectedUserIdForAttendance] = useState(null);
  const [selectedUsernameForAttendance, setSelectedUsernameForAttendance] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setSnackbarMessage('Error loading users. Please try logging in again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setCurrentUserForEdit(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUserForEdit(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    setSaveLoading(true);
    try {
      if (userData.id) {
        await apiClient.put(`/admin/users/${userData.id}`, userData);
        setSnackbarMessage('User updated.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        await apiClient.post('/admin/users', userData);
        setSnackbarMessage('User created.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
      setIsUserModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user', error);
      setSnackbarMessage(error.response?.data?.detail || 'An error occurred during save.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiClient.delete(`/admin/users/${userId}`);
        setSnackbarMessage('User deleted.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user', error);
        setSnackbarMessage(error.response?.data?.detail || 'An error occurred during deletion.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };
  
  const handleViewAttendance = (userId, username) => {
    setSelectedUserIdForAttendance(userId);
    setSelectedUsernameForAttendance(username);
    setIsAttendanceModalOpen(true);
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
          background: 'linear-gradient(to bottom right, #E53E3E, #DD6B20)',
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
        background: 'linear-gradient(to bottom right, #E53E3E, #DD6B20)',
        p: 2,
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: '80rem' }}> {/* maxW="6xl" approx */}
        <GlassPaper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">Admin Dashboard</Typography>
          <Button onClick={handleLogout} variant="outlined" color="error">
            Logout
          </Button>
        </GlassPaper>

        <GlassPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Typography variant="h6" component="h3">All Users</Typography>
            <Button onClick={handleCreateUser} variant="contained" color="primary">Create New User</Button>
          </Box>
          {users.length === 0 ? (
            <Typography textAlign="center">No users found.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Username</TableCell>
                    <TableCell sx={{ color: 'white' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white' }}>Full Name</TableCell>
                    <TableCell sx={{ color: 'white' }}>Role</TableCell>
                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.full_name || 'N/A'}</TableCell>
                      <TableCell><Chip label={user.role} size="small" color={user.role === 'admin' ? 'secondary' : 'primary'} /></TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                            <Button size="small" variant="outlined" onClick={() => handleEditUser(user)}>Edit</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                            <Button size="small" variant="outlined" color="success" onClick={() => handleViewAttendance(user.id, user.username)}>Attendance</Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </GlassPaper>

        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          user={currentUserForEdit}
          onSave={handleSaveUser}
          isLoading={saveLoading}
        />

        <AttendanceModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          userId={selectedUserIdForAttendance}
          username={selectedUsernameForAttendance}
        />
      </Stack>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;