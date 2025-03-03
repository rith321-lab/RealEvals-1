import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw, FiClock, FiTag, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axiosInstance from '../../Helper/axiosInstance';
import HomeLayout from '../../Layouts/HomeLayout';
import { Button, Card, CardContent, Badge, Skeleton } from '../../components/ui';

function DisplayTasksFixed() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      // Get a development token first
      const tokenResponse = await axiosInstance.get('/auth/dev-login');
      const token = tokenResponse.data.access_token;
      
      // Set the token in localStorage and axios headers
      if (token) {
        localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Development login successful, token:', token);
        
        // Now fetch tasks with the token
        const response = await axiosInstance.get('/tasks');
        console.log('Tasks response:', response);
        setTasks(response.data.items || []);
        toast.success('Tasks loaded successfully');
      } else {
        console.error('No token in response:', tokenResponse.data);
        toast.error('Authentication failed. Please try again later.');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Could not load tasks. Please try again later.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && task.difficulty === filter;
  });

  return (
    <HomeLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-gray-600 mt-1">Browse and manage evaluation tasks</p>
          </div>
          <Link to="/tasks/create">
            <Button leftIcon={<FiPlus />} className="mt-4 md:mt-0">
              Create New Task
            </Button>
          </Link>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-48">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <Button
            onClick={fetchTasks}
            variant="secondary"
            leftIcon={<FiRefreshCw className={loading ? "animate-spin" : ""} />}
          >
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-64">
                <CardContent className="p-0">
                  <Skeleton className="h-full rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <Link key={task.id} to={`/task/${task.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant={
                        task.difficulty === 'EASY' ? 'success' : 
                        task.difficulty === 'MEDIUM' ? 'warning' : 'danger'
                      }>
                        {task.difficulty}
                      </Badge>
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiClock className="mr-1" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiTag className="mr-1" />
                      <span>{task.webArenaEnvironment}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || filter !== 'all' 
                ? "Try adjusting your search or filter criteria" 
                : "Create your first task to get started"}
            </p>
            <Link to="/tasks/create" className="mt-6 inline-block">
              <Button leftIcon={<FiPlus />}>Create New Task</Button>
            </Link>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default DisplayTasksFixed;
