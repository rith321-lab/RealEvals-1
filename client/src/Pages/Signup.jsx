import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../Layouts/AuthLayout';
import axiosInstance from '../Helper/axiosInstance';

function Signup() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    firstName: '',
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
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  async function createNewAccount(event) {
    event.preventDefault();

    // Validation checks
    if (!signupData.firstName || !signupData.email || !signupData.password) {
      toast.error('Please fill all the details');
      return;
    }
    if (signupData.firstName.length < 5) {
      toast.error('Name should be at least 5 characters');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      toast.error('Invalid email format');
      return;
    }
    if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,16}$/.test(signupData.password)) {
      toast.error('Password must be 6-16 characters with a number & special character');
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
    }
  }

  return (
    <AuthLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <form 
          onSubmit={createNewAccount} 
          className="flex flex-col gap-6 rounded-lg p-8 w-96 bg-white shadow-xl border border-primary-100"
        >
          <h1 className="text-center text-3xl font-bold text-primary-600">Signup</h1>

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="font-semibold text-lg text-secondary-800">
              Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your name..."
              className="w-full p-3 border border-primary-200 rounded-md focus:ring focus:ring-primary-100 focus:border-primary-400 text-secondary-800"
              onChange={handleUserInput}
              value={signupData.firstName}
            />
          </div>

          {/* Email Input */}
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
              value={signupData.email}
            />
          </div>

          {/* Password Input */}
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
              value={signupData.password}
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-md shadow-md transition-all duration-300"
          >
            CREATE ACCOUNT
          </button>

          <p className="text-center text-lg text-secondary-700">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Signup;
