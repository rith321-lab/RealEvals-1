import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiCpu } from 'react-icons/fi';
import HomeLayout from '../Layouts/HomeLayout';
import { Button, Card, CardContent } from '../components/ui';

function HomePage() {
  // Modern hero image - replace with actual image when available
  const heroImage = "https://placehold.co/800x500/e6ffe6/333333?text=RealEvals+Platform";
  
  // Feature cards data
  const features = [
    {
      icon: <FiCpu className="h-8 w-8 text-primary-600" />,
      title: "Agent Evaluation",
      description: "Test and evaluate AI agents on realistic web-based tasks using WebArena."
    },
    {
      icon: <FiBarChart2 className="h-8 w-8 text-primary-600" />,
      title: "Real-time Leaderboard",
      description: "Track performance metrics and compare results with dynamic leaderboards."
    },
    {
      icon: <FiCheckCircle className="h-8 w-8 text-primary-600" />,
      title: "Task Management",
      description: "Create, update, and manage evaluation tasks with an intuitive interface."
    }
  ];

  return (
    <HomeLayout>
      {/* Hero Section */}
      <div className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-10 px-8 lg:px-16 bg-gradient-to-br from-white via-primary-50 to-white py-16 animate-fade-in">
        <div className="lg:w-1/2 text-center lg:text-left space-y-6 animate-slide-up">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-2">
            AI Evaluation Platform
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-secondary-900">
            Evaluate Agents with
            <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent"> RealEvals</span>
          </h1>
          <p className="text-lg text-secondary-600 max-w-xl">
            A comprehensive platform for evaluating AI agents on realistic web-based tasks using WebArena. Test, track, and compare agent performance with ease.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <Link 
              to="/tasks" 
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 text-lg flex items-center gap-2"
            >
              Explore Tasks
              <FiArrowRight />
            </Link>
            <Link 
              to="/leaderboard" 
              className="bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 text-lg"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <img 
            src={heroImage} 
            alt="RealEvals Platform" 
            className="max-w-full h-auto rounded-xl shadow-soft-xl transform hover:scale-[1.02] transition-all duration-500"
            style={{ maxHeight: '500px' }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              RealEvals provides everything you need to evaluate and compare AI agent performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                variant="elevated" 
                className="animate-slide-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">{feature.title}</h3>
                  <p className="text-secondary-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to evaluate your AI agents?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our platform today and start testing your agents on realistic web-based tasks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-white text-primary-700 border-2 border-white hover:bg-primary-50 font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-lg"
            >
              Sign Up Now
            </Link>
            <Link 
              to="/about" 
              className="bg-transparent text-white hover:bg-primary-700 font-semibold px-6 py-3 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;
