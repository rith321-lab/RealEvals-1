import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiTrash2, FiSettings, FiCheckCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import axiosInstance from '../../Helper/axiosInstance';
import { Button, Card, CardHeader, CardContent, CardFooter, Input, Alert } from '../../components/ui';

function CreateTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [taskInput, setTaskInput] = useState({
    title: '',
    description: '',
    difficulty: '',
    webArenaEnvironment: '',
    environmentConfig: {},
  });
  const [configEntries, setConfigEntries] = useState([]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setTaskInput({ ...taskInput, [name]: value });
  }

  function handleAddConfigEntry() {
    setConfigEntries([...configEntries, { key: '', value: '' }]);
  }

  function handleConfigChange(index, field, value) {
    const updatedEntries = [...configEntries];
    updatedEntries[index][field] = value;
    setConfigEntries(updatedEntries);

    const newConfig = updatedEntries.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});
    setTaskInput({ ...taskInput, environmentConfig: newConfig });
  }

  function handleRemoveConfigEntry(index) {
    const updatedEntries = configEntries.filter((_, i) => i !== index);
    setConfigEntries(updatedEntries);

    const newConfig = updatedEntries.reduce((acc, { key, value }) => {
      if (key) acc[key] = value;
      return acc;
    }, {});
    setTaskInput({ ...taskInput, environmentConfig: newConfig });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!taskInput.title || !taskInput.description || !taskInput.difficulty || !taskInput.webArenaEnvironment) {
      toast.error('All fields are mandatory');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axiosInstance.post('/tasks', taskInput);
      toast.success('Task created successfully!');
      
      // Reset form
      setTaskInput({
        title: '',
        description: '',
        difficulty: '',
        webArenaEnvironment: '',
        environmentConfig: {},
      });
      setConfigEntries([]);
      
      // Navigate back to tasks list
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] py-12 px-4 md:px-8 lg:px-16 flex flex-col items-center bg-gradient-to-br from-white via-primary-50 to-white animate-fade-in">
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-8 animate-slide-up">
            <Link to="/tasks" className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors mr-4">
              <FiArrowLeft className="mr-2" /> Back to Tasks
            </Link>
            <h1 className="text-3xl font-bold text-secondary-900">
              Create <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">New Task</span>
            </h1>
          </div>
          
          <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-full mr-3">
                  <FiSettings className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900">Task Configuration</h2>
                  <p className="text-sm text-secondary-600">Create a new task for agent evaluation</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={onFormSubmit} className="space-y-6">
                <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <Input
                    label="Task Title"
                    id="title"
                    name="title"
                    placeholder="Enter a descriptive title for the task"
                    value={taskInput.title}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-secondary-700">
                      Task Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-secondary-800 resize-none"
                      placeholder="Describe the task in detail, including objectives and success criteria"
                      value={taskInput.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-secondary-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-secondary-800"
                      value={taskInput.difficulty}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select difficulty</option>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                  
                  <Input
                    label="Web Arena Environment"
                    id="webArenaEnvironment"
                    name="webArenaEnvironment"
                    placeholder="e.g., Staynb, Omnizon"
                    value={taskInput.webArenaEnvironment}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-secondary-700">
                      Environment Configuration
                    </label>
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      leftIcon={<FiPlus />}
                      onClick={handleAddConfigEntry}
                    >
                      Add Config
                    </Button>
                  </div>
                  
                  {configEntries.length === 0 ? (
                    <Alert variant="info" className="text-sm">
                      Add configuration entries to customize the task environment. These are key-value pairs that will be passed to the WebArena environment.
                    </Alert>
                  ) : (
                    <div className="space-y-3 bg-primary-50 p-4 rounded-lg border border-primary-100">
                      {configEntries.map((entry, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <div className="flex-1">
                            <Input
                              placeholder="Key"
                              value={entry.key}
                              onChange={(e) => handleConfigChange(index, 'key', e.target.value)}
                              size="sm"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              placeholder="Value"
                              value={entry.value}
                              onChange={(e) => handleConfigChange(index, 'value', e.target.value)}
                              size="sm"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleRemoveConfigEntry(index)}
                          >
                            <FiTrash2 />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-primary-100 flex justify-end animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mr-3"
                    onClick={() => navigate('/tasks')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    leftIcon={loading ? null : <FiCheckCircle />}
                    isLoading={loading}
                  >
                    {loading ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CreateTask;
