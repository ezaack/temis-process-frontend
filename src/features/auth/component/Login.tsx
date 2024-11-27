import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
} from '@mui/material';
import { Alert } from '@mui/material';
import { useUserContext } from '../../../context/UserContext';
import { authService } from '../api/authService';

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useUserContext(); // Get the context to set user data
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await authService.login({ login, password });
      setUser(userData); // Store user data in context
      navigate('/dashboard'); // Redirect to dashboard or home page
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, width: '400px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Login"
                variant="outlined"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
} 