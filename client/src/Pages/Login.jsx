import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../Helper/axiosInstance';
import { AuthContext } from '../utils/AuthContext';
import HomeLayout from '../Layouts/HomeLayout';

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
      <div className="min-h-[90vh] flex flex-col justify-center items-center bg-gradient-to-b from-white to-primary-50 py-12">
        <form 
          onSubmit={handleLogin}
          className="flex flex-col justify-center gap-6 rounded-lg p-8 w-96 bg-white shadow-xl border border-primary-100"
        >
          <h1 className="text-center text-3xl font-bold text-primary-600">Login</h1>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-primary-700 font-medium">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email"
              className="bg-white border border-primary-200 px-3 py-2 rounded-lg text-secondary-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              onChange={handleUserInput}
              value={user.email}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-primary-700 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password"
              className="bg-white border border-primary-200 px-3 py-2 rounded-lg text-secondary-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              onChange={handleUserInput}
              value={user.password}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 py-2 px-3 rounded-lg bg-primary-700 text-white font-semibold transition-all duration-300 hover:bg-primary-800 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="text-center text-secondary-700">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-700 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Login;
