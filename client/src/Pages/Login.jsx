import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../Helper/axiosInstance';
import { AuthContext } from '../utils/AuthContext';
import HomeLayout from '../Layouts/HomeLayout';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  InputAdornment, 
  IconButton,
  Avatar,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { 
  CardContainer, 
  FormField, 
  LoadingButton, 
  fadeInAnimation 
} from '../components/SharedComponents';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  function handleUserInput(e) {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function handleLogin(e) {
    e.preventDefault();
    
    if (!user.email || !user.password) {
      toast.error('All fields are required');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axiosInstance.post('/users/login', user);
      
      if (response.status === 200) {
        const { token, user: userData } = response.data;
        
        // Store token and userData
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('role', userData.role);
        
        // Update auth context
        login(userData, token);
        
        toast.success('Login successful');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <HomeLayout>
      <Container component="main" maxWidth="xs" sx={{ 
        minHeight: '90vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        ...fadeInAnimation
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            background: 'linear-gradient(to bottom right, #ffffff, #f0fdf4)',
            borderRadius: 2,
            border: '1px solid #dcfce7',
            width: '100%',
            maxWidth: 400
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5" color="primary.dark" fontWeight="bold" mb={1}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to continue to RealEvals
          </Typography>
          
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <FormField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={user.email}
              onChange={handleUserInput}
              variant="outlined"
            />
            <FormField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={user.password}
              onChange={handleUserInput}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              loading={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </LoadingButton>
            
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{ 
                    color: '#16a34a', 
                    fontWeight: 500, 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#15803d'}
                  onMouseOut={(e) => e.target.style.color = '#16a34a'}
                >
                  Sign up now
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </HomeLayout>
  );
}

export default Login;
