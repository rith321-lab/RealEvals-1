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
