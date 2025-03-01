import React from 'react';
import { Link } from 'react-router-dom';

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header with Logo */}
      <header className="w-full p-4 bg-white shadow-sm">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-700">RealEvals</h1>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout; 