import React, { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

function HomeLayout({ children }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('access_token'));
      setUserRole(localStorage.getItem('role') || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  function hideDrawer() {
    const element = document.getElementsByClassName('drawer-toggle');
    element[0].checked = false;
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_data');

    window.dispatchEvent(new Event('storage'));

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Drawer for Sidebar */}
      <div className="drawer absolute left-0 z-50 w-fit">
        <input className="drawer-toggle" id="my-drawer" type="checkbox" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu size={'32px'} className="font-bold text-primary-600 m-4 hover:text-primary-700 transition-colors" />
          </label>
        </div>
        <div className="drawer-side w-auto">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          {/* Sidebar Content */}
          <ul className="menu p-4 w-48 h-[100%] sm:w-80 bg-gradient-to-br from-white to-primary-50 shadow-lg text-secondary-800 relative border-r border-primary-100">
            {/* Close Button */}
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer} className="hover:bg-primary-100 rounded-full p-1 transition-colors">
                <AiFillCloseCircle size={24} className="text-primary-500" />
              </button>
            </li>
            {/* Navigation Links */}
            <li className="my-1">
              <Link to="/" className="rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-primary-200 hover:text-primary-700 transition-all font-medium">Home</Link>
            </li>
            {isLoggedIn && userRole === 'ADMIN' && (
              <>
                <li className="my-1">
                  <Link to="/admin/dashboard" className="rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-primary-200 hover:text-primary-700 transition-all font-medium">Admin Dashboard</Link>
                </li>
                <li className="my-1">
                  <Link to="/tasks/create" className="rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-primary-200 hover:text-primary-700 transition-all font-medium">Create Task</Link>
                </li>
              </>
            )}
            <li className="my-1">
              <Link to="/tasks" className="rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-primary-200 hover:text-primary-700 transition-all font-medium">All Tasks</Link>
            </li>
            <li className="my-1">
              <Link to="/leaderboard" className="rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-primary-200 hover:text-primary-700 transition-all font-medium">Leaderboard</Link>
            </li>
            <li className="my-1">
              <Link to="/contact" className="rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-primary-200 hover:text-primary-700 transition-all font-medium">Contact Us</Link>
            </li>
            <li className="my-1">
              <Link to="/about" className="rounded-lg hover:bg-gradient-to-r hover:from-white hover:to-primary-200 hover:text-primary-700 transition-all font-medium">About Us</Link>
            </li>

            {/* Login/Signup or Profile/Logout Buttons */}
            <div className="w-full flex items-center justify-center gap-3 mt-8">
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-md transition-colors w-full text-center">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-white hover:bg-gray-100 text-primary-600 border border-primary-300 px-5 py-2 rounded-md transition-colors w-full text-center">
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/user/profile" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-md transition-colors w-full text-center">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="bg-white hover:bg-gray-100 text-primary-600 border border-primary-300 px-5 py-2 rounded-md transition-colors w-full">
                    Logout
                  </button>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-16">
        {children}
      </div>
    </div>
  );
}

export default HomeLayout;
