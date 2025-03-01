import React, { useState } from 'react';
import HomeLayout from '../Layouts/HomeLayout';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success simulation
      setSubmitStatus({
        success: true,
        message: 'Your message has been sent successfully! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-8 md:px-20 flex flex-col">
        <h1 className="text-3xl font-semibold mb-8 text-secondary-800">
          Contact <span className="font-bold text-primary-600">Us</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
            <h2 className="text-xl font-semibold mb-6 text-primary-700">Get in Touch</h2>
            
            {submitStatus && (
              <div className={`p-4 mb-6 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm text-secondary-600 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-white border border-primary-200 rounded text-secondary-800 focus:border-primary-400 focus:ring focus:ring-primary-100"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-secondary-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 bg-white border border-primary-200 rounded text-secondary-800 focus:border-primary-400 focus:ring focus:ring-primary-100"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm text-secondary-600 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-2 bg-white border border-primary-200 rounded text-secondary-800 focus:border-primary-400 focus:ring focus:ring-primary-100"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm text-secondary-600 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-2 bg-white border border-primary-200 rounded text-secondary-800 focus:border-primary-400 focus:ring focus:ring-primary-100"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-primary-600 text-white rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'} transition-colors`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
              <h2 className="text-xl font-semibold mb-4 text-primary-700">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-primary-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">Email</h3>
                    <p className="text-secondary-600">contact@realevals.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">Phone</h3>
                    <p className="text-secondary-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-primary-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-800">Location</h3>
                    <p className="text-secondary-600">San Francisco, CA, USA</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-lg shadow-md border border-primary-200">
              <h2 className="text-xl font-semibold mb-4 text-primary-700">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-primary-600">How do I create an account?</h3>
                  <p className="text-secondary-600 mt-1">
                    Simply click on the "Sign Up" button in the top right corner and follow the registration process.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-primary-600">Can I create my own tasks?</h3>
                  <p className="text-secondary-600 mt-1">
                    Currently, only administrators can create tasks. However, you can request specific task types through our contact form.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-primary-600">How are agents evaluated?</h3>
                  <p className="text-secondary-600 mt-1">
                    Agents are evaluated based on task completion, accuracy, efficiency, and time taken. Each task has specific criteria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Contact;
