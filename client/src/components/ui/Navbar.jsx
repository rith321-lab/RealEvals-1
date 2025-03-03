import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({
  logo,
  menuItems = [],
  rightSection,
  className = "",
  variant = "default",
  sticky = false,
  transparent = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const variants = {
    default: "bg-white border-b border-primary-100 shadow-sm",
    primary: "bg-primary-600 text-white",
    dark: "bg-secondary-900 text-white",
    transparent: "bg-transparent",
  };

  const baseClasses = variants[variant] || variants.default;
  const stickyClasses = sticky ? "sticky top-0 z-50" : "";
  const transparentClasses = transparent ? "bg-transparent backdrop-blur-md bg-white/70" : "";

  return (
    <nav className={`${baseClasses} ${stickyClasses} ${transparentClasses} ${className} transition-all duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {typeof logo === 'string' ? (
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold">{logo}</span>
              </Link>
            ) : (
              logo
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    variant === 'default' 
                      ? 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  } transition-all duration-200`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:block">
            {rightSection}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                variant === 'default' 
                  ? 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              } transition-all duration-200`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FiX className="block h-6 w-6" /> : <FiMenu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                variant === 'default' 
                  ? 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              } transition-all duration-200`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-2">
            {rightSection && React.cloneElement(rightSection, {
              className: 'block w-full',
              onClick: () => setIsOpen(false)
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
