import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import HomeLayout from '../Layouts/HomeLayout';
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
      navigate('/');
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

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('role', role);

      toast.success('Login successful!');

      window.dispatchEvent(new Event('storage'));

      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed!');
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-[90vh] bg-base-200">
        <form
          onSubmit={onLogin}
          className="flex flex-col justify-center gap-6 rounded-lg p-8 w-96 bg-base-100 shadow-2xl"
        >
          Notify
          <h1 className="text-center text-3xl font-bold text-primary">Login</h1>
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
              value={loginData.email}
            />
          </div>
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
              value={loginData.password}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4 text-lg">
            Login
          </button>
          <p className="text-center text-lg">
            Don't have an account?{' '}
            <Link to="/signup" className="text-secondary hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Login;
