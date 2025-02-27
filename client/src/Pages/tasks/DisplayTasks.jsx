import { useEffect, useState } from 'react';
import axiosInstance from '../../Helper/axiosInstance';
import HomeLayout from '../../Layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';

function DisplayTasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const handleClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axiosInstance.get('/tasks');
        console.log(response);
        setTasks(response.data.items);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center text-white">
        <h1 className="text-center text-3xl font-semibold mb-8">
          Available <span className="font-bold text-yellow-500">Tasks</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => {
                handleClick(task.id);
              }}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm"
            >
              <h2 className="text-xl font-bold text-yellow-400 mb-2">{task.title}</h2>
              <p className="text-sm text-gray-300 mb-4">{task.description}</p>
              <span className="text-sm font-semibold bg-blue-600 px-3 py-1 rounded-full">{task.difficulty}</span>
            </div>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default DisplayTasks;
