import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeLayout from '../Layouts/HomeLayout';
import { toast } from 'react-hot-toast';
import { 
  FiTrash2, FiEye, FiUsers, FiClipboard, FiBarChart2, 
  FiCpu, FiCheckCircle, FiClock, FiPlus, FiGrid, FiList,
  FiAlertCircle, FiActivity
} from 'react-icons/fi';
import axiosInstance from '../Helper/axiosInstance';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter,
  Button, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell,
  Spinner
} from '../components/ui';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskStats, setTaskStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [agentStats, setAgentStats] = useState({ total: 0, active: 0 });

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/tasks?limit=100');
      setTasks(response.data.items);

      const total = response.data.items.length;
      const pending = response.data.items.filter((task) => !task.isComplete).length;
      const completed = total - pending;
      setTaskStats({ total, pending, completed });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await axiosInstance.get('/agents');
      setAgents(response.data);
      const total = response.data.length;
      const active = response.data.filter((agent) => agent.isActive).length;
      setAgentStats({ total, active });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to fetch agents');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTasks();
      await fetchAgents();
    };

    fetchData();
  }, []);

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper function to get badge variant based on difficulty
  const getDifficultyBadgeVariant = (difficulty) => {
    if (!difficulty) return 'primary';
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === 'easy') return 'success';
    if (lowerDifficulty === 'medium') return 'warning';
    if (lowerDifficulty === 'hard') return 'danger';
    return 'primary';
  };

  return (
    <HomeLayout>
      <div className="min-h-[90vh] py-12 px-4 md:px-8 lg:px-16 flex flex-col items-center bg-gradient-to-br from-white via-primary-50 to-white animate-fade-in">
        <div className="w-full max-w-7xl">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-2">
              <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">Admin Dashboard</span>
            </h1>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Manage tasks, agents, and monitor platform performance
            </p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card variant="flat" className="bg-gradient-to-br from-primary-50 to-white border-l-4 border-primary-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">Total Tasks</p>
                    <p className="text-3xl font-bold text-primary-700">{taskStats.total}</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-full">
                    <FiClipboard className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="flat" className="bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">Completed Tasks</p>
                    <p className="text-3xl font-bold text-green-600">{taskStats.completed}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="flat" className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">Total Agents</p>
                    <p className="text-3xl font-bold text-blue-600">{agentStats.total}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FiCpu className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="flat" className="bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">Active Agents</p>
                    <p className="text-3xl font-bold text-purple-600">{agentStats.active}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FiActivity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 border-b border-primary-100 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              className={`px-4 py-3 md:px-6 md:py-4 transition-all duration-300 rounded-t-lg text-base md:text-lg flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'bg-white text-primary-700 border-b-4 border-primary-600 font-semibold shadow-soft-md'
                  : 'bg-primary-50 text-secondary-600 hover:bg-white hover:text-primary-600'
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              <FiClipboard />
              Tasks Management
            </button>
            <button
              className={`px-4 py-3 md:px-6 md:py-4 transition-all duration-300 rounded-t-lg text-base md:text-lg flex items-center gap-2 ${
                activeTab === 'agents'
                  ? 'bg-white text-primary-700 border-b-4 border-primary-600 font-semibold shadow-soft-md'
                  : 'bg-primary-50 text-secondary-600 hover:bg-white hover:text-primary-600'
              }`}
              onClick={() => setActiveTab('agents')}
            >
              <FiUsers />
              Agents Management
            </button>
          </div>

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <FiClipboard className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900">Tasks</h2>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    leftIcon={<FiGrid />}
                    className="hidden md:flex"
                  >
                    Grid View
                  </Button>
                  <Link to="/tasks/create">
                    <Button 
                      leftIcon={<FiPlus />}
                    >
                      Create New Task
                    </Button>
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <Card key={task.id} variant="elevated" className="h-full transform transition-all duration-300 hover:shadow-soft-lg hover:scale-[1.02]">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-secondary-900 line-clamp-1">{task.title}</h3>
                            <Badge variant={getDifficultyBadgeVariant(task.difficulty)}>
                              {task.difficulty || 'Unknown'}
                            </Badge>
                          </div>
                          
                          <p className="text-secondary-600 mb-4 line-clamp-2">
                            {task.description ? task.description.substring(0, 100) + (task.description.length > 100 ? '...' : '') : 'No description'}
                          </p>
                          
                          <div className="space-y-2 text-sm text-secondary-500 mb-4">
                            <div className="flex items-center">
                              <FiBarChart2 className="mr-2 h-4 w-4" />
                              <span>Environment: {task.webArenaEnvironment || 'Standard'}</span>
                            </div>
                            <div className="flex items-center">
                              <FiClock className="mr-2 h-4 w-4" />
                              <span>Created: {formatDate(task.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-auto pt-2">
                            <Link to={`/tasks/${task.id}`}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                leftIcon={<FiEye />}
                              >
                                View
                              </Button>
                            </Link>
                            <Button 
                              variant="danger" 
                              size="sm"
                              leftIcon={<FiTrash2 />}
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-primary-50 rounded-lg">
                      <div className="bg-white p-4 rounded-full inline-flex mb-4 shadow-soft-sm">
                        <FiAlertCircle className="h-8 w-8 text-secondary-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-800 mb-3">No tasks found</h3>
                      <p className="text-secondary-600 max-w-md mx-auto mb-6">
                        Create your first task to start evaluating agents on the platform.
                      </p>
                      <Link to="/tasks/create">
                        <Button leftIcon={<FiPlus />}>
                          Create Task
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center mb-6">
                <div className="bg-primary-100 p-2 rounded-full mr-3">
                  <FiUsers className="h-5 w-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900">Agents</h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Spinner size="lg" />
                </div>
              ) : (
                <Card variant="elevated">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHeaderCell>Name</TableHeaderCell>
                          <TableHeaderCell>Description</TableHeaderCell>
                          <TableHeaderCell className="w-24">Status</TableHeaderCell>
                          <TableHeaderCell className="w-40">Created At</TableHeaderCell>
                          <TableHeaderCell className="w-24">Actions</TableHeaderCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agents.length > 0 ? (
                          agents.map((agent) => (
                            <TableRow key={agent.id} isHoverable={true}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <FiCpu className="mr-2 text-primary-500" />
                                  {agent.name}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {agent.description || 'No description'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={agent.isActive ? 'success' : 'danger'}>
                                  {agent.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <FiClock className="mr-1 text-secondary-500" />
                                  {formatDate(agent.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Link to={`/agents/${agent.id}`}>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    leftIcon={<FiEye />}
                                  >
                                    View
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-10">
                              <div className="flex flex-col items-center">
                                <div className="bg-primary-50 p-3 rounded-full mb-3">
                                  <FiCpu className="h-6 w-6 text-secondary-400" />
                                </div>
                                <p className="text-lg font-medium text-secondary-800 mb-1">No agents found</p>
                                <p className="text-secondary-600">Agents will appear here once they are created.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
};

export default AdminDashboard;
