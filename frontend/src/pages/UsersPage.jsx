import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users/');
        setUsers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Error: {error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Users
      </Typography>
      {users.length === 0 ? (
        <Typography>No users found. Please create some users via the backend API.</Typography>
      ) : (
        <List>
          {users.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemText
                primary={
                  <>
                    <Typography component="span" variant="body1" fontWeight="bold">ID:</Typography> {user.id},{' '}
                    <Typography component="span" variant="body1" fontWeight="bold">Username:</Typography> {user.username},{' '}
                    <Typography component="span" variant="body1" fontWeight="bold">Email:</Typography> {user.email},{' '}
                    <Typography component="span" variant="body1" fontWeight="bold">Full Name:</Typography> {user.full_name || 'N/A'},{' '}
                    <Typography component="span" variant="body1" fontWeight="bold">Role:</Typography> {user.role}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default UsersPage;