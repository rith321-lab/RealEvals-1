import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../Layouts/AuthLayout';
import axiosInstance from '../Helper/axiosInstance';
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
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAddAlt1Outlined } from '@mui/icons-material';
import { 
  CardContainer, 
  FormField, 
  LoadingButton, 
  fadeInAnimation 
} from '../components/SharedComponents';

function Signup() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    firstName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Personal Info', 'Account Details', 'Confirmation'];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [navigate]);

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0 && !signupData.firstName) {
      toast.error('Please enter your name');
      return;
    }
    
    if (activeStep === 0 && signupData.firstName.length < 5) {
      toast.error('Name should be at least 5 characters');
      return;
    }
    
    if (activeStep === 1) {
      if (!signupData.email) {
        toast.error('Please enter your email');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
        toast.error('Invalid email format');
        return;
      }
      if (!signupData.password) {
        toast.error('Please enter a password');
        return;
      }
      if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,16}$/.test(signupData.password)) {
        toast.error('Password must be 6-16 characters with a number & special character');
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  async function createNewAccount() {
    setLoading(true);
    
    try {
      const response = axiosInstance.post('/auth/register', signupData);

      toast.promise(response, {
        loading: 'Creating your account...',
        success: (res) => {
          const { access_token, refresh_token, role } = res.data;

          // Store tokens in localStorage
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('role', role);

          navigate('/');
          return 'Account created successfully!';
        },
        error: (error) => error.response?.data?.detail || 'Failed to create account',
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Container component="main" maxWidth="sm" sx={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
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
            width: '100%'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <PersonAddAlt1Outlined />
          </Avatar>
          <Typography component="h1" variant="h5" color="primary.dark" fontWeight="bold" mb={1}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Join RealEvals to evaluate AI agents
          </Typography>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ width: '100%' }}>
            {activeStep === 0 && (
              <Box>
                <FormField
                  autoFocus
                  required
                  fullWidth
                  id="firstName"
                  label="Full Name"
                  name="firstName"
                  autoComplete="name"
                  value={signupData.firstName}
                  onChange={handleUserInput}
                  helperText="Please enter your full name (at least 5 characters)"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  fullWidth
                  sx={{ mt: 2, py: 1.5 }}
                >
                  Continue
                </Button>
              </Box>
            )}
            
            {activeStep === 1 && (
              <Box>
                <FormField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={signupData.email}
                  onChange={handleUserInput}
                />
                <FormField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={signupData.password}
                  onChange={handleUserInput}
                  helperText="6-16 characters with at least one number and one special character"
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Review
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeStep === 2 && (
              <Box>
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {signupData.firstName}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {signupData.email}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={createNewAccount}
                    loading={loading}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Create Account
                  </LoadingButton>
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#16a34a', 
                    fontWeight: 500, 
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#15803d'}
                  onMouseOut={(e) => e.target.style.color = '#16a34a'}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </AuthLayout>
  );
}

export default Signup;
