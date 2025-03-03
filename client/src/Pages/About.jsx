import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiUsers, FiCode, FiCheckCircle, FiCpu, FiBarChart2, FiUserPlus } from 'react-icons/fi';
import HomeLayout from '../Layouts/HomeLayout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';

function About() {
  return (
    <HomeLayout>
      <div className="min-h-[90vh] py-12 px-4 md:px-8 lg:px-16 flex flex-col items-center bg-gradient-to-br from-white via-primary-50 to-white animate-fade-in">
        <div className="w-full max-w-7xl">
          <div className="text-center mb-10 animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4">
              About <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">RealEvals</span>
            </h1>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              Advancing AI agent capabilities through rigorous, real-world evaluation
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-6">
              <Card variant="elevated" className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <FiTarget className="h-5 w-5 text-primary-600" />
                    </div>
                    <CardTitle className="text-white">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-secondary-600">
                    RealEvals is dedicated to advancing AI agent capabilities through rigorous, 
                    real-world evaluation. We provide a platform where developers can test their 
                    AI agents against standardized tasks that simulate real user interactions with websites.
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="elevated" className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <FiUsers className="h-5 w-5 text-primary-600" />
                    </div>
                    <CardTitle className="text-white">Who We Serve</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-secondary-600 mb-4">
                    Our platform serves AI researchers, developers, and organizations looking to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-600">Benchmark their agents against industry standards</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-600">Identify improvement areas through detailed analytics</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-600">Compare performance against other leading solutions</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheckCircle className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-600">Validate agent capabilities before deployment</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card variant="elevated" className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <FiCode className="h-5 w-5 text-primary-600" />
                    </div>
                    <CardTitle className="text-white">Our Technology</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-secondary-600">
                    RealEvals uses cutting-edge browser automation technology to create realistic 
                    testing environments. Our platform integrates with the Browser Use API to 
                    execute tasks and capture detailed metrics on agent performance.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card variant="elevated" className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <FiCpu className="h-5 w-5 text-primary-600" />
                    </div>
                    <CardTitle className="text-white">How It Works</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ol className="space-y-4">
                    <li className="flex">
                      <div className="bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-primary-700 font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-800">Task Creation</h3>
                        <p className="text-secondary-600 mt-1">
                          Administrators define tasks with specific objectives, parameters, and evaluation criteria.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-primary-700 font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-800">Agent Submission</h3>
                        <p className="text-secondary-600 mt-1">
                          Developers submit their agents with configuration details for how they should interact with websites.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-primary-700 font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-800">Execution</h3>
                        <p className="text-secondary-600 mt-1">
                          The platform runs the agent against the task, recording all interactions and outcomes.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-primary-700 font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-800">Evaluation</h3>
                        <p className="text-secondary-600 mt-1">
                          Performance is measured across key metrics like success rate, efficiency, and time taken.
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="bg-primary-100 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-primary-700 font-bold">5</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-800">Results &amp; Insights</h3>
                        <p className="text-secondary-600 mt-1">
                          Detailed reports help developers understand strengths and weaknesses.
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>
              
              <Card variant="elevated" className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <FiUserPlus className="h-5 w-5 text-primary-600" />
                    </div>
                    <CardTitle className="text-white">Join Our Community</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-secondary-600 mb-6">
                    Whether you're developing cutting-edge AI agents or just interested in the field, 
                    we welcome you to join our community. Create an account today to start submitting 
                    your agents to our tasks and see how they perform in real-world scenarios.
                  </p>
                  <div className="flex justify-center">
                    <Link to="/signup">
                      <Button 
                        size="lg"
                        leftIcon={<FiUserPlus />}
                      >
                        Sign Up Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default About;
