import React, { useState, useEffect } from 'react';
import HomeLayout from '../Layouts/HomeLayout';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiEye, FiUsers, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import axiosInstance from '../Helper/axiosInstance';

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

  return (
    <HomeLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-200 shadow rounded-lg">
            <div className="stat-figure text-primary">
              <FiClipboard size={24} />
            </div>
            <div className="stat-title">Total Tasks</div>
            <div className="stat-value text-primary">{taskStats.total}</div>
          </div>

          <div className="stat bg-base-200 shadow rounded-lg">
            <div className="stat-figure text-secondary">
              <FiBarChart2 size={24} />
            </div>
            <div className="stat-title">Completed Tasks</div>
            <div className="stat-value text-secondary">{taskStats.completed}</div>
          </div>

          <div className="stat bg-base-200 shadow rounded-lg">
            <div className="stat-figure text-accent">
              <FiUsers size={24} />
            </div>
            <div className="stat-title">Total Agents</div>
            <div className="stat-value text-accent">{agentStats.total}</div>
          </div>

          <div className="stat bg-base-200 shadow rounded-lg">
            <div className="stat-figure text-info">
              <FiUsers size={24} />
            </div>
            <div className="stat-title">Active Agents</div>
            <div className="stat-value text-info">{agentStats.active}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed mb-6">
          <a className={`tab ${activeTab === 'tasks' ? 'tab-active' : ''}`} onClick={() => setActiveTab('tasks')}>
            Tasks Management
          </a>
          <a className={`tab ${activeTab === 'agents' ? 'tab-active' : ''}`} onClick={() => setActiveTab('agents')}>
            Agents Management
          </a>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <a href="/tasks/create" className="btn btn-primary">
                Create New Task
              </a>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task.id} className="card bg-base-200 shadow-lg">
                      <div className="card-body">
                        <h2 className="card-title">{task.title}</h2>
                        <div className="badge badge-primary mb-2">{task.difficulty}</div>
                        <p className="text-sm mb-2 overflow-hidden text-ellipsis" style={{ maxHeight: '3rem' }}>
                          {task.description.substring(0, 100)}...
                        </p>
                        <div className="text-sm opacity-70">
                          <p>Environment: {task.webArenaEnvironment}</p>
                          <p>Created: {formatDate(task.createdAt)}</p>
                        </div>
                        <div className="card-actions justify-end mt-2">
                          <a href={`/tasks/${task.id}`} className="btn btn-sm btn-outline">
                            <FiEye /> View
                          </a>
                          <button className="btn btn-sm btn-error" onClick={() => handleDeleteTask(task.id)}>
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-lg">No tasks found. Create your first task!</p>
                    <a href="/tasks/create" className="btn btn-primary mt-4">
                      Create Task
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Agents</h2>

            {loading ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.length > 0 ? (
                      agents.map((agent) => (
                        <tr key={agent.id}>
                          <td>{agent.name}</td>
                          <td>{agent.description || 'No description'}</td>
                          <td>
                            <div className={`badge ${agent.isActive ? 'badge-success' : 'badge-error'}`}>
                              {agent.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </td>
                          <td>{formatDate(agent.createdAt)}</td>
                          <td>
                            <a href={`/agents/${agent.id}`} className="btn btn-xs btn-outline mr-2">
                              <FiEye /> View
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-10">
                          <p className="text-lg">No agents found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default AdminDashboard;
