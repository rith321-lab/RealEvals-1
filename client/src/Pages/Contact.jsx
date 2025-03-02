import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiHelpCircle, FiUser, FiMessageSquare } from 'react-icons/fi';
import HomeLayout from '../Layouts/HomeLayout';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Alert } from '../components/ui';

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
      <div className="min-h-[90vh] py-12 px-4 md:px-8 lg:px-16 flex flex-col items-center bg-gradient-to-br from-white via-primary-50 to-white animate-fade-in">
        <div className="w-full max-w-7xl">
          <div className="text-center mb-10 animate-slide-up">
            <h1 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4">
              Contact <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card variant="elevated" className="h-fit">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full mr-3">
                    <FiMessageSquare className="h-5 w-5 text-primary-600" />
                  </div>
                  <CardTitle className="text-white">Get in Touch</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {submitStatus && (
                  <Alert 
                    variant={submitStatus.success ? 'success' : 'danger'}
                    className="mb-6"
                  >
                    {submitStatus.message}
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Your Name"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    leftIcon={<FiUser className="text-secondary-400" />}
                  />
                  
                  <Input
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    leftIcon={<FiMail className="text-secondary-400" />}
                  />
                  
                  <Input
                    label="Subject"
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  
                  <div className="space-y-1">
                    <label htmlFor="message" className="block text-sm font-medium text-secondary-700">
                      Message
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2"
                        placeholder="How can we help you?"
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                      leftIcon={<FiSend />}
                      isLoading={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <FiMail className="h-5 w-5 text-primary-600" />
                    </div>
                    <CardTitle className="text-white">Contact Information</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start p-3 hover:bg-primary-50 rounded-lg transition-colors">
                      <div className="bg-primary-100 p-3 rounded-full text-primary-600 mr-4">
                        <FiMail className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary-800 text-lg">Email</h3>
                        <a href="mailto:contact@realevals.com" className="text-primary-600 hover:text-primary-700 transition-colors">
                          contact@realevals.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 hover:bg-primary-50 rounded-lg transition-colors">
                      <div className="bg-primary-100 p-3 rounded-full text-primary-600 mr-4">
                        <FiPhone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary-800 text-lg">Phone</h3>
                        <a href="tel:+15551234567" className="text-primary-600 hover:text-primary-700 transition-colors">
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 hover:bg-primary-50 rounded-lg transition-colors">
                      <div className="bg-primary-100 p-3 rounded-full text-primary-600 mr-4">
                        <FiMapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary-800 text-lg">Location</h3>
                        <p className="text-secondary-600">San Francisco, CA, USA</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="elevated">
                <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 py-4">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-full mr-3">
                      <FiHelpCircle className="h-5 w-5 text-primary-600" />
                    </div>
                    <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-5">
                    <div className="p-3 hover:bg-primary-50 rounded-lg transition-colors">
                      <h3 className="font-semibold text-primary-700 text-lg">How do I create an account?</h3>
                      <p className="text-secondary-600 mt-2">
                        Simply click on the "Sign Up" button in the navigation menu and follow the registration process.
                      </p>
                    </div>
                    
                    <div className="p-3 hover:bg-primary-50 rounded-lg transition-colors">
                      <h3 className="font-semibold text-primary-700 text-lg">Can I create my own tasks?</h3>
                      <p className="text-secondary-600 mt-2">
                        Currently, only administrators can create tasks. However, you can request specific task types through our contact form.
                      </p>
                    </div>
                    
                    <div className="p-3 hover:bg-primary-50 rounded-lg transition-colors">
                      <h3 className="font-semibold text-primary-700 text-lg">How are agents evaluated?</h3>
                      <p className="text-secondary-600 mt-2">
                        Agents are evaluated based on task completion, accuracy, efficiency, and time taken. Each task has specific criteria.
                      </p>
                    </div>
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

export default Contact;
