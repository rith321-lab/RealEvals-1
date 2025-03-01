import { useState } from 'react';
import HomeLayout from '../../Layouts/HomeLayout';
import axiosInstance from '../../Helper/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AddTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    parameters: '',
    browserUseConfig: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate JSON inputs
      let parametersJson, browserUseConfigJson;
      
      try {
        parametersJson = JSON.parse(formData.parameters);
      } catch (error) {
        toast.error('Invalid JSON in Task Parameters');
        return;
      }
      
      try {
        browserUseConfigJson = JSON.parse(formData.browserUseConfig);
      } catch (error) {
        toast.error('Invalid JSON in Browser Use API Configuration');
        return;
      }

      // Generate a unique task ID
      const taskId = `task-${Date.now()}`;
      
      console.log('Sending API request with:', {
        taskId,
        parameters: parametersJson,
        browserUseConfig: browserUseConfigJson
      });
      
      // Submit to the API
      const response = await axiosInstance.post('/tasks/execute', {
        taskId: taskId,
        parameters: parametersJson,
        browserUseConfig: browserUseConfigJson
      });
      
      toast.success('Task created and executed successfully!');
      console.log('Task response:', response.data);
      
      // Also create the task in the database
      try {
        await axiosInstance.post('/tasks', {
          id: taskId,
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          parameters: parametersJson,
          browserUseConfig: browserUseConfigJson
        });
      } catch (createError) {
        console.error('Error creating task in database:', createError);
        toast.error('Task was executed but could not be saved to database');
      }
      
      // Navigate to the task details page
      navigate(`/task/${taskId}`);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(`Failed to create and execute task: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-8 md:px-20 flex flex-col text-secondary-800">
        <h1 className="page-header">
          Create New <span className="text-primary-600">Task</span>
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-primary-50 p-8 rounded-xl shadow-md border border-primary-200">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows="3"
              className="form-input"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty" className="form-label">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleFormChange}
              className="form-input"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Very Hard">Very Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="parameters" className="form-label">
              Task Parameters (JSON)
            </label>
            <textarea
              id="parameters"
              name="parameters"
              value={formData.parameters}
              onChange={handleFormChange}
              rows="10"
              className="form-input font-mono text-sm"
              placeholder="Enter a valid JSON object with task parameters"
              required
            ></textarea>
          </div>

          <div className="form-group mb-8">
            <label htmlFor="browserUseConfig" className="form-label">
              Browser Use API Configuration (JSON)
            </label>
            <textarea
              id="browserUseConfig"
              name="browserUseConfig"
              value={formData.browserUseConfig}
              onChange={handleFormChange}
              rows="10"
              className="form-input font-mono text-sm"
              placeholder="Enter a valid JSON object with Browser Use API configuration"
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 font-semibold px-5 py-2 rounded-md shadow-md transition-all duration-300 mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-5 py-2 rounded-md shadow-md transition-all duration-300"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}

export default AddTask;