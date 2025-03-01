import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../Layouts/AuthLayout';
import axiosInstance from '../Helper/axiosInstance';

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [navigate]);

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function onLogin(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill all the details');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/login', loginData);
      const { access_token, refresh_token, role } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('role', role);

      toast.success('Login successful!');

      navigate('/'); // Redirect to home page
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed!');
    }
  }

  return (
    <AuthLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <form
          onSubmit={onLogin}
          className="flex flex-col justify-center gap-6 rounded-lg p-8 w-96 bg-white shadow-xl border border-primary-100"
        >
          <h1 className="text-center text-3xl font-bold text-primary-600">Login</h1>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-lg text-secondary-800">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email..."
              className="w-full p-3 border border-primary-200 rounded-md focus:ring focus:ring-primary-100 focus:border-primary-400 text-secondary-800"
              onChange={handleUserInput}
              value={loginData.email}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold text-lg text-secondary-800">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password..."
              className="w-full p-3 border border-primary-200 rounded-md focus:ring focus:ring-primary-100 focus:border-primary-400 text-secondary-800"
              onChange={handleUserInput}
              value={loginData.password}
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-md shadow-md transition-all duration-300"
          >
            LOGIN
          </button>

          <p className="text-center text-lg text-secondary-700">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-800 font-medium">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
