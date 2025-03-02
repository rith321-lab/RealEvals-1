import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50 to-white animate-fade-in">
      {/* Simple Header with Logo */}
      <header className="w-full p-4 bg-white shadow-sm border-b border-primary-100">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <FiArrowLeft className="mr-2 text-primary-600 group-hover:text-primary-700 transition-colors" />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              RealEvals
            </h1>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;  