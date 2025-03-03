import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axiosInstance from '../Helper/axiosInstance';
import { AuthContext } from '../utils/AuthContext';
import HomeLayout from '../Layouts/HomeLayout';
import { Card, CardHeader, CardContent, CardFooter, Input, Button, Spinner } from '../components/ui';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

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

  async function handleLogin(e) {
    e.preventDefault();
    
    if (!user.email || !user.password) {
      toast.error('All fields are required');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email: user.email });
      const response = await axiosInstance.post('/api/v1/auth/login', user);
      
      console.log('Login response:', response);
      
      if (response.status === 200) {
        // Log the full response data to see what we're getting
        console.log('Login successful, full response data:', response.data);
        
        // Extract tokens and role from response
        const { access_token, refresh_token, role, token_type } = response.data;
        
        if (!access_token) {
          console.error('No access token found in response:', response.data);
          toast.error('Authentication error: No token received');
          return;
        }
        
        console.log('Storing tokens in localStorage...');
        
        // Store tokens and role
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token || '');
        localStorage.setItem('token_type', token_type || 'bearer');
        localStorage.setItem('role', role || 'USER'); // Default to USER if role is not provided
        
        // Create user data object from login info
        const userData = {
          email: user.email,
          role: role || 'USER'
        };
        
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        console.log('Tokens stored in localStorage:', {
          access_token: localStorage.getItem('access_token'),
          role: localStorage.getItem('role'),
          user_data: localStorage.getItem('user_data')
        });
        
        // Update auth context
        console.log('Updating auth context...');
        login(userData, access_token);
        
        toast.success('Login successful');
        console.log('Authentication state updated, redirecting to home page');
        
        // Add a small delay before navigation to ensure state updates
        setTimeout(() => {
          // Force a page reload to ensure the auth state is fully updated
          window.location.href = '/tasks/create';
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Failed to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex flex-col justify-center items-center bg-gradient-to-br from-white via-primary-50 to-white py-12 animate-fade-in">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold text-secondary-900">
              Welcome <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Back</span>
            </h1>
            <p className="mt-2 text-secondary-600">Sign in to your account to continue</p>
          </div>
          
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-center justify-center w-16 h-16 mx-auto -mt-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 shadow-soft-lg">
                <FiLogIn className="w-8 h-8 text-white" />
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={user.email}
                  onChange={handleUserInput}
                  required
                  helperText="We'll never share your email with anyone else."
                  className="animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                />
                
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={handleUserInput}
                  required
                  className="animate-slide-up"
                  style={{ animationDelay: '0.3s' }}
                />
                
                <div className="flex justify-between items-center text-sm animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-secondary-600">
                      Remember me
                    </label>
                  </div>
                  <div>
                    <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full animate-slide-up"
                  style={{ animationDelay: '0.5s' }}
                  leftIcon={loading ? <Spinner size="sm" variant="white" /> : null}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <p className="text-secondary-700">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary-700 hover:text-primary-800 font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-sm text-secondary-500 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Login;
