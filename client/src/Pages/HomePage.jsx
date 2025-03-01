import React from 'react';
import { Link } from 'react-router-dom';
import HomeLayout from '../Layouts/HomeLayout';

function HomePage() {
  const placeholderImage = "https://placehold.co/600x300/e6ffe6/333333?text=RealEvals+Platform";

  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-10 px-8 lg:px-16 text-white">
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Evaluate Agents with
            <span className="text-yellow-500"> RealEvals</span>
          </h1>
          <p className="text-lg text-gray-300">Test Agents with ease</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <Link 
              to="/tasks" 
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300"
            >
              Explore Tasks
            </Link>
            <Link 
              to="/leaderboard" 
              className="bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img 
            src={placeholderImage} 
            alt="RealEvals Platform" 
            className="max-w-full h-auto rounded-lg shadow-xl"
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;
