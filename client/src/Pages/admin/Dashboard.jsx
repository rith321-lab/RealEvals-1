import React, { useState, useEffect } from 'react';
import HomeLayout from '../../Layouts/HomeLayout';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalUsers: 0,
    totalAgents: 0,
    totalSubmissions: 0
  });
  
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulated data - would be replaced with actual API calls
    setStats({
      totalTasks: 12,
      totalUsers: 45,
      totalAgents: 32,
      totalSubmissions: 78
    });

    setRecentSubmissions([
      { id: 1, task: 'Web Search Task', agent: 'SearchBot v1', user: 'user1', status: 'completed', score: 89 },
      { id: 2, task: 'Form Filling Task', agent: 'FormFiller', user: 'user2', status: 'failed', score: 23 },
      { id: 3, task: 'Navigation Task', agent: 'Navigator Pro', user: 'user3', status: 'completed', score: 95 },
      { id: 4, task: 'Data Extraction Task', agent: 'DataMiner', user: 'user4', status: 'in_progress', score: null }
    ]);
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 px-8 md:px-20 flex flex-col">
        <h1 className="text-3xl font-semibold mb-8 text-secondary-800">
          Admin <span className="font-bold text-primary-600">Dashboard</span>
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gradient-to-br from-white to-primary-100 p-6 rounded-lg shadow-md border border-primary-200 hover:to-primary-200 transition-all hover:shadow-lg">
            <h3 className="text-lg font-medium text-secondary-600">Total Tasks</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalTasks}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-primary-100 p-6 rounded-lg shadow-md border border-primary-200 hover:to-primary-200 transition-all hover:shadow-lg">
            <h3 className="text-lg font-medium text-secondary-600">Total Users</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-primary-100 p-6 rounded-lg shadow-md border border-primary-200 hover:to-primary-200 transition-all hover:shadow-lg">
            <h3 className="text-lg font-medium text-secondary-600">Total Agents</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalAgents}</p>
          </div>
          <div className="bg-gradient-to-br from-white to-primary-100 p-6 rounded-lg shadow-md border border-primary-200 hover:to-primary-200 transition-all hover:shadow-lg">
            <h3 className="text-lg font-medium text-secondary-600">Total Submissions</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalSubmissions}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button 
            onClick={() => navigate('/tasks/create')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create New Task
          </button>
          <button 
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Export Results
          </button>
          <button 
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Manage Users
          </button>
        </div>

        {/* Recent Submissions Table */}
        <h2 className="text-xl font-semibold mb-4 text-secondary-800">Recent Submissions</h2>
        <div className="overflow-x-auto rounded-lg border border-primary-200 shadow-md">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-primary-50">
              <tr>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">ID</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">Task</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">Agent</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">User</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">Status</th>
                <th className="py-3 px-4 text-left text-secondary-700 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission) => (
                <tr key={submission.id} className="border-t border-gray-100 hover:bg-primary-50 transition-colors">
                  <td className="py-3 px-4 text-secondary-800">{submission.id}</td>
                  <td className="py-3 px-4 text-secondary-800">{submission.task}</td>
                  <td className="py-3 px-4 text-secondary-800">{submission.agent}</td>
                  <td className="py-3 px-4 text-secondary-800">{submission.user}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                      submission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary-800">{submission.score ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  );
}

export default AdminDashboard;
