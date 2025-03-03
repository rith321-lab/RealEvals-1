import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../Helper/axiosInstance';

const AddTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    webArenaEnvironment: 'BROWSER',
    environmentConfig: '{}'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        toast.error('You must be logged in to submit a task');
        navigate('/login');
        return;
      }
      
      console.log('Using token:', token);
      
      // Parse the environmentConfig JSON string into an object
      let parsedConfig = {};
      try {
        parsedConfig = formData.environmentConfig ? JSON.parse(formData.environmentConfig) : {};
      } catch (parseError) {
        toast.error('Invalid JSON format in Browser Configuration');
        setLoading(false);
        return;
      }
      
      const requestData = {
        ...formData,
        environmentConfig: parsedConfig
      };
      
      console.log('Sending request data:', requestData);
      
      // Use axiosInstance from Helper instead of direct axios
      // Import axiosInstance at the top of the file
      const response = await axiosInstance.post(
        '/api/v1/tasks', 
        requestData
      );
      
      // Log the response for debugging
      console.log('Task creation response:', response);
      
      // Check if the response is successful (status 200 or 201)
      if (response.status === 200 || response.status === 201) {
        toast.success('Task created successfully!');
        navigate('/tasks');
      } else {
        // This should not happen with axios (it throws on error status codes)
        console.error('Unexpected response status:', response.status);
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      
      // Store the error for debugging
      localStorage.setItem('last_error', JSON.stringify({
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      }));
      
      if (error.name === 'SyntaxError') {
        toast.error('Invalid JSON format in Browser Configuration');
      } else if (error.response) {
        // Handle specific error responses
        toast.error(error.response.data?.detail || `Error ${error.response.status}: Failed to create task`);
      } else if (error.request) {
        // Handle network errors
        toast.error('Network error: Could not connect to server');
      } else {
        // Handle other errors
        toast.error(error.message || 'Failed to create task');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Submit a New Task</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Task Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficulty">
            Difficulty
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="webArenaEnvironment">
            Environment
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="webArenaEnvironment"
            name="webArenaEnvironment"
            value={formData.webArenaEnvironment}
            onChange={handleChange}
            required
          >
            <option value="BROWSER">Browser</option>
            <option value="API">API</option>
            <option value="CLI">CLI</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="environmentConfig">
            Browser Configuration (JSON)
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 font-mono"
            id="environmentConfig"
            name="environmentConfig"
            value={formData.environmentConfig}
            onChange={handleChange}
            placeholder="{}"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
            id="submit-task-button"
          >
            {loading ? 'Submitting...' : 'Submit Task'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate('/tasks')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
