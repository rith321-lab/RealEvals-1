import React from 'react';
import HomeLayout from '../Layouts/HomeLayout';

function About() {
  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-8 md:px-20 flex flex-col">
        <h1 className="text-3xl font-semibold mb-8 text-secondary-800">
          About <span className="font-bold text-primary-600">RealEvals</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <section className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
              <h2 className="text-xl font-semibold mb-3 text-primary-700">Our Mission</h2>
              <p className="text-secondary-600">
                RealEvals is dedicated to advancing AI agent capabilities through rigorous, 
                real-world evaluation. We provide a platform where developers can test their 
                AI agents against standardized tasks that simulate real user interactions with websites.
              </p>
            </section>
            
            <section className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
              <h2 className="text-xl font-semibold mb-3 text-primary-700">Who We Serve</h2>
              <p className="text-secondary-600">
                Our platform serves AI researchers, developers, and organizations looking to:
              </p>
              <ul className="list-disc list-inside mt-2 text-secondary-600 space-y-1">
                <li>Benchmark their agents against industry standards</li>
                <li>Identify improvement areas through detailed analytics</li>
                <li>Compare performance against other leading solutions</li>
                <li>Validate agent capabilities before deployment</li>
              </ul>
            </section>
            
            <section className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
              <h2 className="text-xl font-semibold mb-3 text-primary-700">Our Technology</h2>
              <p className="text-secondary-600">
                RealEvals uses cutting-edge browser automation technology to create realistic 
                testing environments. Our platform integrates with the Browser Use API to 
                execute tasks and capture detailed metrics on agent performance.
              </p>
            </section>
          </div>
          
          <div className="space-y-6">
            <section className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
              <h2 className="text-xl font-semibold mb-3 text-primary-700">How It Works</h2>
              <ol className="list-decimal list-inside text-secondary-600 space-y-3">
                <li>
                  <strong className="text-secondary-800">Task Creation:</strong>
                  <p className="ml-6 mt-1">
                    Administrators define tasks with specific objectives, parameters, and evaluation criteria.
                  </p>
                </li>
                <li>
                  <strong className="text-secondary-800">Agent Submission:</strong>
                  <p className="ml-6 mt-1">
                    Developers submit their agents with configuration details for how they should interact with websites.
                  </p>
                </li>
                <li>
                  <strong className="text-secondary-800">Execution:</strong>
                  <p className="ml-6 mt-1">
                    The platform runs the agent against the task, recording all interactions and outcomes.
                  </p>
                </li>
                <li>
                  <strong className="text-secondary-800">Evaluation:</strong>
                  <p className="ml-6 mt-1">
                    Performance is measured across key metrics like success rate, efficiency, and time taken.
                  </p>
                </li>
                <li>
                  <strong className="text-secondary-800">Results &amp; Insights:</strong>
                  <p className="ml-6 mt-1">
                    Detailed reports help developers understand strengths and weaknesses.
                  </p>
                </li>
              </ol>
            </section>
            
            <section className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
              <h2 className="text-xl font-semibold mb-3 text-primary-700">Join Our Community</h2>
              <p className="text-secondary-600">
                Whether you're developing cutting-edge AI agents or just interested in the field, 
                we welcome you to join our community. Create an account today to start submitting 
                your agents to our tasks and see how they perform in real-world scenarios.
              </p>
              <div className="mt-4">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors">
                  Sign Up Now
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default About;
