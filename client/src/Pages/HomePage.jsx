import React from 'react';
import { Link } from 'react-router-dom';
import HomeLayout from '../Layouts/HomeLayout';

function HomePage() {
  const placeholderImage = "https://placehold.co/600x300/e6ffe6/333333?text=RealEvals+Platform";

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-800 mb-4">
          RealEvals
        </h1>
        
        <p className="text-xl md:text-2xl text-secondary-700 mb-6 max-w-2xl">
          The next-gen evaluation platform for assessing real-world capabilities of AI agents
        </p>

        <div className="mb-8">
          <img 
            src={placeholderImage} 
            alt="RealEvals Platform" 
            className="max-w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: '300px' }}
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link 
            to="/tasks" 
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold text-lg px-8 py-3 rounded-md shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            Explore Tasks
          </Link>
          <Link 
            to="/leaderboard" 
            className="bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 font-semibold text-lg px-8 py-3 rounded-md shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            View Leaderboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
            <h3 className="text-xl font-semibold text-primary-700 mb-2">Real-World Testing</h3>
            <p className="text-secondary-600">
              Evaluate AI agents on tasks that simulate real-world environments and challenges.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
            <h3 className="text-xl font-semibold text-primary-700 mb-2">Comprehensive Metrics</h3>
            <p className="text-secondary-600">
              Track performance across multiple dimensions including accuracy, efficiency, and adaptability.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
            <h3 className="text-xl font-semibold text-primary-700 mb-2">Fair Comparisons</h3>
            <p className="text-secondary-600">
              Compare different AI systems on a level playing field with standardized evaluation protocols.
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;
