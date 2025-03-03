import { useEffect, useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiCpu } from 'react-icons/fi';
import axiosInstance from '../../Helper/axiosInstance';
import HomeLayout from '../../Layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Card, CardContent, Badge, Spinner } from '../../components/ui';

function DisplayTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const navigate = useNavigate();

  const handleClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/v1/tasks');
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

  // Filter tasks based on search query and difficulty filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = filterDifficulty === '' || 
      task.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    
    return matchesSearch && matchesDifficulty;
  });

  // Get difficulty badge variant
  const getDifficultyVariant = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] py-12 px-4 md:px-8 lg:px-16 flex flex-col items-center bg-gradient-to-br from-white via-primary-50 to-white animate-fade-in">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-slide-up">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
                Available <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Tasks</span>
              </h1>
              <p className="text-secondary-600 mt-2">Browse and select tasks to evaluate AI agents</p>
            </div>
            <Button 
              onClick={() => navigate('/tasks/create')}
              leftIcon={<FiPlus />}
              className="animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Create Task
            </Button>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-xl shadow-soft-md mb-8 flex flex-col md:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-secondary-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-primary-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-800"
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 pointer-events-none" />
              </div>
              
              <div className="flex border border-primary-200 rounded-lg overflow-hidden">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'bg-white text-secondary-600'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <FiGrid />
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'bg-white text-secondary-600'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tasks Display */}
          {loading ? (
            <div className="flex justify-center items-center h-64 animate-fade-in">
              <Spinner size="xl" />
              <span className="ml-3 text-secondary-700">Loading tasks...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <Card variant="elevated" className="w-full text-center py-16 animate-fade-in">
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-primary-100 p-4 rounded-full mb-4">
                    <FiCpu className="h-10 w-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-2">No tasks available</h3>
                  <p className="text-secondary-600 mb-6">
                    {searchQuery || filterDifficulty 
                      ? "No tasks match your search criteria. Try adjusting your filters."
                      : "Create a new task to get started with agent evaluations."}
                  </p>
                  <Button 
                    onClick={() => navigate('/tasks/create')}
                    leftIcon={<FiPlus />}
                  >
                    Create Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {filteredTasks.map((task, index) => (
                <Card
                  key={task.id}
                  onClick={() => handleClick(task.id)}
                  className="cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-soft-lg animate-slide-up"
                  style={{ animationDelay: `${0.1 * (index % 6)}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-secondary-900">{task.title}</h2>
                      <Badge variant={getDifficultyVariant(task.difficulty)}>
                        {task.difficulty}
                      </Badge>
                    </div>
                    <p className="text-secondary-600 mb-4 line-clamp-3">{task.description}</p>
                    <div className="flex justify-between items-center mt-4 text-sm text-secondary-500">
                      <span>Environment: {task.webArenaEnvironment || 'Standard'}</span>
                      <span className="text-primary-600 font-medium">View Details →</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {filteredTasks.map((task, index) => (
                <Card
                  key={task.id}
                  onClick={() => handleClick(task.id)}
                  className="cursor-pointer transition-all duration-300 hover:shadow-soft-lg animate-slide-up"
                  style={{ animationDelay: `${0.05 * (index % 10)}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-lg font-bold text-secondary-900">{task.title}</h2>
                          <Badge variant={getDifficultyVariant(task.difficulty)}>
                            {task.difficulty}
                          </Badge>
                        </div>
                        <p className="text-secondary-600 line-clamp-2">{task.description}</p>
                      </div>
                      <div className="flex items-center mt-3 md:mt-0">
                        <span className="text-sm text-secondary-500 mr-4">Environment: {task.webArenaEnvironment || 'Standard'}</span>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

export default DisplayTasks;
