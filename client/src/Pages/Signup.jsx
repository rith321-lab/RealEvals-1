import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import AuthLayout from '../Layouts/AuthLayout';
import axiosInstance from '../Helper/axiosInstance';
import { Card, CardHeader, CardContent, CardFooter, Input, Button, Alert } from '../components/ui';

function Signup() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    firstName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: '',
  });

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

    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  }

  function checkPasswordStrength(password) {
    if (!password) {
      setPasswordStrength({ score: 0, message: '', color: '' });
      return;
    }

    let score = 0;
    let message = '';
    let color = '';

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 10) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set message and color based on score
    if (score <= 2) {
      message = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      message = 'Medium';
      color = 'bg-yellow-500';
    } else {
      message = 'Strong';
      color = 'bg-green-500';
    }

    setPasswordStrength({ score, message, color });
  }

  async function createNewAccount(event) {
    event.preventDefault();
    setLoading(true);

    // Validation checks
    if (!signupData.firstName || !signupData.email || !signupData.password) {
      toast.error('Please fill all the details');
      setLoading(false);
      return;
    }
    if (signupData.firstName.length < 5) {
      toast.error('Name should be at least 5 characters');
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      toast.error('Invalid email format');
      setLoading(false);
      return;
    }
    if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,16}$/.test(signupData.password)) {
      toast.error('Password must be 6-16 characters with a number & special character');
      setLoading(false);
      return;
    }

    try {
      const response = axiosInstance.post('/api/v1/auth/register', signupData);

      toast.promise(response, {
        loading: 'Creating your account...',
        success: (res) => {
          const { access_token, refresh_token, role } = res.data;

          // Store tokens in localStorage
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('role', role);

          // Create user data object from signup info
          const userData = {
            email: signupData.email,
            firstName: signupData.firstName,
            role: role
          };
          
          localStorage.setItem('user_data', JSON.stringify(userData));

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
      <div className="min-h-[90vh] flex flex-col justify-center items-center bg-gradient-to-br from-white via-primary-50 to-white py-12 animate-fade-in">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold text-secondary-900">
              Create <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Account</span>
            </h1>
            <p className="mt-2 text-secondary-600">Join our platform to evaluate AI agents</p>
          </div>
          
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-center justify-center w-16 h-16 mx-auto -mt-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 shadow-soft-lg">
                <FiUserPlus className="w-8 h-8 text-white" />
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={createNewAccount} className="space-y-5">
                <Input
                  label="Full Name"
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your full name"
                  value={signupData.firstName}
                  onChange={handleUserInput}
                  required
                  leftIcon={<FiUser className="text-primary-500" />}
                  className="animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                />
                
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={handleUserInput}
                  required
                  leftIcon={<FiMail className="text-primary-500" />}
                  className="animate-slide-up"
                  style={{ animationDelay: '0.3s' }}
                />
                
                <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={signupData.password}
                    onChange={handleUserInput}
                    required
                    leftIcon={<FiLock className="text-primary-500" />}
                  />
                  
                  {signupData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-secondary-600">Password strength:</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength.message === 'Strong' ? 'text-green-600' : 
                          passwordStrength.message === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {passwordStrength.message}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color}`} 
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-secondary-500">
                        Password must be 6-16 characters with at least one number and one special character.
                      </p>
                    </div>
                  )}
                </div>
                
                <Alert 
                  variant="info" 
                  className="animate-slide-up" 
                  style={{ animationDelay: '0.5s' }}
                >
                  <p className="text-xs">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </Alert>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full animate-slide-up"
                  style={{ animationDelay: '0.6s' }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="text-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <p className="text-secondary-700">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-700 hover:text-primary-800 font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Signup;
