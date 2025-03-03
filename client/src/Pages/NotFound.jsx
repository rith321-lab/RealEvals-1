import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { Button } from '../components/ui';

function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-primary-900 to-secondary-900 px-4 animate-fade-in">
      <div className="relative">
        <h1 className="text-8xl sm:text-9xl font-extrabold text-white tracking-widest opacity-90 animate-slide-up">404</h1>
        <div className="bg-primary-600 text-white px-3 py-1 text-sm rounded-md rotate-12 absolute top-0 right-0 transform translate-x-2 -translate-y-3 shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Page not found
        </div>
      </div>
      
      <p className="text-primary-100 text-xl mt-8 text-center max-w-md animate-slide-up" style={{ animationDelay: '0.3s' }}>
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <Button
          variant="outline"
          size="lg"
          leftIcon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          className="bg-transparent text-white border-white hover:bg-white/10"
        >
          Go Back
        </Button>
        
        <Link to="/">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<FiHome />}
            className="bg-white text-primary-900 hover:bg-primary-50"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
