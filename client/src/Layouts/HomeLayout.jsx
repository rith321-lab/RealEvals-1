import React, { useState, useEffect } from 'react';
import { FiMenu, FiHome, FiGrid, FiList, FiAward, FiMail, FiInfo, FiLogIn, FiUserPlus, FiUser, FiLogOut } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui';

function HomeLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('access_token'));
      setUserRole(localStorage.getItem('role') || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  function hideDrawer() {
    setIsMobileMenuOpen(false);
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

  // Navigation items
  const navItems = [
    { to: '/', label: 'Home', icon: <FiHome className="h-5 w-5" /> },
    ...(isLoggedIn && userRole === 'ADMIN' ? [
      { to: '/admin/dashboard', label: 'Admin Dashboard', icon: <FiGrid className="h-5 w-5" /> },
      { to: '/tasks/create', label: 'Create Task', icon: <FiList className="h-5 w-5" /> }
    ] : []),
    { to: '/tasks', label: 'All Tasks', icon: <FiList className="h-5 w-5" /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <FiAward className="h-5 w-5" /> },
    { to: '/contact', label: 'Contact Us', icon: <FiMail className="h-5 w-5" /> },
    { to: '/about', label: 'About Us', icon: <FiInfo className="h-5 w-5" /> }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 border-b border-primary-100">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-4 p-2 rounded-full hover:bg-primary-50 transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              <FiMenu className="h-6 w-6 text-primary-600" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                RealEvals
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive(item.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftIcon={<FiLogIn />}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    size="sm"
                    leftIcon={<FiUserPlus />}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/user/profile">
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftIcon={<FiUser />}
                  >
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="primary" 
                  size="sm"
                  leftIcon={<FiLogOut />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={hideDrawer}
      ></div>
      
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-primary-100 flex justify-between items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            RealEvals
          </span>
          <button 
            onClick={hideDrawer}
            className="p-2 rounded-full hover:bg-primary-50 transition-colors"
          >
            <FiMenu className="h-5 w-5 text-primary-600" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive(item.to)
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 space-y-2 border-t border-primary-100 pt-4">
            {!isLoggedIn ? (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center px-4 py-2 rounded-md text-secondary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  <FiLogIn className="mr-3 h-5 w-5" />
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center px-4 py-2 rounded-md text-secondary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  <FiUserPlus className="mr-3 h-5 w-5" />
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/user/profile" 
                  className="flex items-center px-4 py-2 rounded-md text-secondary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  <FiUser className="mr-3 h-5 w-5" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 rounded-md text-secondary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

export default HomeLayout;
