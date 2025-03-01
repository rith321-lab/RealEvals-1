import { useEffect, useState } from 'react';
import axiosInstance from '../../Helper/axiosInstance';
import HomeLayout from '../../Layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function DisplayTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/tasks');
        console.log(response);
        setTasks(response.data.items || []);
      } catch (error) {
        console.error('Error fetching tasks from API:', error);
        toast.error('Could not load tasks. Please try again later.');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-secondary-800">
            Available <span className="font-bold text-primary-600">Tasks</span>
          </h1>
          <button 
            onClick={() => navigate('/tasks/create')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Create Task
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-xl text-secondary-600 mb-4">No tasks available</p>
            <p className="text-secondary-500">Create a new task to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  handleClick(task.id);
                }}
                className="bg-gradient-to-br from-white to-primary-100 p-6 rounded-2xl shadow-lg w-full max-w-sm cursor-pointer hover:to-primary-200 transition-all border border-primary-200 hover:shadow-xl"
              >
                <h2 className="text-xl font-bold text-primary-700 mb-2">{task.title}</h2>
                <p className="text-sm text-secondary-700 mb-4">{task.description}</p>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  task.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-800' 
                    : task.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {task.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

export default DisplayTasks;
