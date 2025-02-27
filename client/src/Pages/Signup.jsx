import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import HomeLayout from '../Layouts/HomeLayout';
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
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-[90vh] bg-base-200">
        <form onSubmit={createNewAccount} className="flex flex-col gap-6 rounded-lg p-8 w-96 bg-base-100 shadow-2xl">
          <h1 className="text-center text-3xl font-bold text-primary">Signup</h1>

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="font-semibold text-lg">
              Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your name..."
              className="input input-bordered w-full"
              onChange={handleUserInput}
              value={signupData.firstName}
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-lg">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email..."
              className="input input-bordered w-full"
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold text-lg">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password..."
              className="input input-bordered w-full"
              onChange={handleUserInput}
              value={signupData.password}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4 text-lg">
            Create Account
          </button>

          <p className="text-center text-lg">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signup;
